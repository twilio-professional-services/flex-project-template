import * as Flex from '@twilio/flex-ui';

import { Worker } from '../../../../types/task-router';
import { EncodedParams } from '../../../../types/serverless';
import { ChatTransferNotification } from '../../flex-hooks/notifications/ChatTransfer';
import { TransferOptions } from '../../flex-hooks/actions/TransferTask';
import ApiService from '../../../../utils/serverless/ApiService';
import TaskService from '../../../../utils/serverless/TaskRouter/TaskRouterService';
import { WorkerAttributes } from 'types/task-router/Worker';

export interface CreateTransferTaskResponse {
  success: boolean;
  taskSid: string;
  message?: string;
}

export interface CompleteTransferredTaskResponse {
  success: boolean;
  message?: string;
}

export interface RemoveChatChannelFromTaskResponse {
  success: boolean;
}

export interface UpdateChannelAttributesResponse {
  success: boolean;
}

export interface Queue {
  date_updated: Date;
  queue_name: string;
  queue_sid: string;
  workspace_sid: string;
}

/**
 * Currently not in use because of issue where TaskQueues will not show up
 * if they have not had a task assigned to them within the last 30 days...
 */
const QueueInstantQuery = (queryExpression: string): Promise<{ [queueSid: string]: Queue }> => {
  const { insightsClient } = Flex.Manager.getInstance();
  return new Promise(async (resolve, reject) => {
    try {
      const query = await insightsClient.instantQuery('tr-queue');
      query.once('searchResult', (queues) => resolve(queues));
      query.search(queryExpression);
    } catch (e) {
      reject(e);
    }
  });
};

const WorkerInstantQuery = (queryExpression: string): Promise<{ [workerSid: string]: any }> => {
  const { insightsClient } = Flex.Manager.getInstance();
  return new Promise(async (resolve, reject) => {
    try {
      const query = await insightsClient.instantQuery('tr-worker');
      query.once('searchResult', (queues) => resolve(queues));
      query.search(queryExpression);
    } catch (e) {
      reject(e);
    }
  });
};

export const getWorkerFriendlyName = (worker: Worker) => {
  return worker?.attributes?.public_identity || worker?.attributes?.full_name?.split(' ')?.[0] || 'Support Desk';
};

class ChatTransferService extends ApiService {
  // Chat transfer is performed by creating another task that
  // brings another agent into the chat channel
  // we store info on our original task so we know its been transferred
  // allowing us to identify and perform the right actions when the task
  // is completed
  async executeChatTransfer(
    task: Flex.ITask,
    transferTargetSid: string,
    options?: TransferOptions,
  ): Promise<CreateTransferTaskResponse> {
    try {
      const workerResult = await WorkerInstantQuery(`data.worker_sid EQ "${transferTargetSid}"`);
      const workerFriendlyName = getWorkerFriendlyName(workerResult[transferTargetSid]);

      /**
       * Originally we want to use the QueueInstantQuery to lookup
       * the queue but that can be prone to falling out of sync
       * if the environment has not been used in a while
       * queues need to have been assigned a Task within the last 30
       * days to show up in query
       */

      // const queueResult = await QueueInstantQuery(`data.queue_sid EQ "${transferTargetSid}"`);
      // const queueName = queueResult[transferTargetSid]?.queue_name || task.queueName;

      const queues = await TaskService.getQueues();
      const queueResult = queues
        ? queues.find((queue) => {
            return queue.sid === transferTargetSid;
          })
        : null;
      const queueName = queueResult?.friendlyName || task.queueName;

      // create a new task to deliver the transfer
      const {
        success,
        taskSid: transferTaskSid,
        message,
      } = await this.#createTransferTask(task, transferTargetSid, queueName);
      if (success) {
        // notify the channel that a transfer was started
        const transferTarget = transferTargetSid.startsWith('WK') ? workerFriendlyName : queueName;
        Flex.Actions.invokeAction('SendMessage', {
          channelSid: task.attributes.channelSid,
          body: `${options?.mode.toLowerCase()} transfer to \"${transferTarget}\" initiated`,
          messageAttributes: { notification: true },
        });

        // if succesful update existing task to preserve transfer data
        const updatedTaskAttributes = {
          autoClose: true,
          chatTransferData: {
            transferTaskSid,
            transferType: options?.mode,
          },
        };
        const success = await TaskService.updateTaskAttributes(task.taskSid, updatedTaskAttributes);
        if (!success) {
          // in the unlikely event we were unable to update the task notify the user
          Flex.Notifications.showNotification(ChatTransferNotification.ErrorUpdatingTaskForChatTransfer);
        }
        if (options?.mode === 'COLD') {
          // for cold transfers we move the task to wrapup immediately
          Flex.Actions.invokeAction('WrapupTask', { task });
        }
      } else {
        Flex.Notifications.showNotification(ChatTransferNotification.ErrorTransferingChat, { message });
      }

      return { success, taskSid: transferTaskSid, message };
    } catch (error) {
      if (error instanceof TypeError) {
        error.message = 'Unable to reach host';
      }
      const { message } = error as any;
      Flex.Notifications.showNotification(ChatTransferNotification.ErrorTransferingChat, { message });
      return { success: false, taskSid: '', message: undefined };
    }
  }

  // Transferred tasks to be completed by the backend
  // creating a uniform method of capturing the task complete reason
  // as well as ensuring the channelSid is removed from task attributes.
  // If a task is completed with a channelSid attributes - the flex flow
  // janitor (if it is enabled) will close the chat channel.
  async completeTransferredTask(task: Flex.ITask): Promise<Boolean> {
    try {
      const {
        attributes: {
          channelSid,
          chatTransferData: { transferType },
        },
        taskSid,
      } = task;

      // Perform associated chat orchestration task for task
      Flex.ChatOrchestrator.orchestrateCompleteTask(task);
      const { success } = await this.#completeTransferredTask(taskSid, transferType, channelSid);
      return success;
    } catch (error) {
      return false;
    }
  }

  #createTransferTask = (
    task: Flex.ITask,
    transferTargetSid: string,
    queueName: string,
  ): Promise<CreateTransferTaskResponse> => {
    const { attributes } = task;
    const manager = Flex.Manager.getInstance();
    const { contact_uri } = manager.workerClient.attributes as WorkerAttributes;

    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(manager.user.token),
      conversationId: encodeURIComponent(attributes.conversations?.conversation_id || task.taskSid),
      jsonAttributes: encodeURIComponent(JSON.stringify(attributes)),
      transferTargetSid: encodeURIComponent(transferTargetSid),
      transferQueueName: encodeURIComponent(queueName),
      ignoreWorkerContactUri: encodeURIComponent(contact_uri),
    };

    return this.fetchJsonWithReject<CreateTransferTaskResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/features/chat-transfer/flex/create-transfer-task`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    ).then((response): CreateTransferTaskResponse => {
      return {
        ...response,
      };
    });
  };

  #completeTransferredTask = (
    taskSid: string,
    transferType: string,
    channelSid: string,
  ): Promise<CompleteTransferredTaskResponse> => {
    const manager = Flex.Manager.getInstance();

    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(manager.user.token),
      taskSid: encodeURIComponent(taskSid),
      transferType: encodeURIComponent(transferType),
      channelSid: encodeURIComponent(channelSid),
    };

    return this.fetchJsonWithReject<CompleteTransferredTaskResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/features/chat-transfer/flex/complete-task-for-transfer`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    ).then((response): CompleteTransferredTaskResponse => {
      return {
        ...response,
      };
    });
  };
}

export default new ChatTransferService();
