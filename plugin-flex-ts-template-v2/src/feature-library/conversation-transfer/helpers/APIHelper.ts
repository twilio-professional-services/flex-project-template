import { ITask, Manager, ConversationState, TaskHelper } from '@twilio/flex-ui';

import TaskService from '../../../utils/serverless/TaskRouter/TaskRouterService';
import { EncodedParams } from '../../../types/serverless';
import ApiService from '../../../utils/serverless/ApiService';
import { getWorkerName } from './inviteTracker';

const manager: any | undefined = Manager.getInstance();

export interface RemoveParticipantRESTPayload {
  conversationSid: string;
  flexInteractionSid: string; // KDxxx sid for inteactions API
  flexInteractionChannelSid: string; // UOxxx sid for interactions API
  flexInteractionParticipantSid: string; // UTxxx sid for interactions API for the transferrring agent to remove
}

export interface TransferRESTPayload {
  taskSid: string; // sid of task to be transferred
  conversationId: string; // for linking transfer task in insights (CHxxx or WTxxx sid)
  conversationSid: string; // for storing invite to attributes (CHxxx sid)
  jsonAttributes: string; // string representation of attributes for new task
  transferTargetSid: string; // worker or queue sid
  transferQueueName: string; // only valid if transfer to queue
  transferWorkerName: string; // only valid if transfer to worker
  workersToIgnore: object; // {key: value} - where key is the taskrouter attribute to set and value is a string array of names of agents in conversation to make sure they don't get reservations to join again
  flexInteractionSid: string; // KDxxx sid for inteactions API
  flexInteractionChannelSid: string; // UOxxx sid for interactions API
  removeFlexInteractionParticipantSid: string; // UTxxx sid for interactions API for the transferrring agent to remove them from conversation
}

const _getMyParticipantSid = (participants: any): string => {
  const myParticipant = participants.find(
    (participant: any) => participant.mediaProperties?.identity === manager.conversationsClient?.user?.identity,
  );

  return myParticipant ? myParticipant.participantSid : '';
};

const _getAgentsWorkerSidArray = (participants: any) => {
  return participants.reduce((prevArray: string[], currentParticipant: any) => {
    if (currentParticipant.type === 'agent' && currentParticipant?.routingProperties?.workerSid) {
      return [...prevArray, currentParticipant?.routingProperties?.workerSid];
    }
    return prevArray;
  }, []);
};

const _queueNameFromSid = async (transferTargetSid: string) => {
  let queues;

  try {
    queues = await TaskService.getQueues();
  } catch (error) {
    console.error('conversation-transfer: Unable to get queues', error);
  }

  const queueResult = queues
    ? queues.find((queue) => {
        return queue.sid === transferTargetSid;
      })
    : null;

  return queueResult?.friendlyName || '';
};

export const buildRemoveMyPartiticipantAPIPayload = async (
  conversation: ConversationState.ConversationState,
): Promise<RemoveParticipantRESTPayload | null> => {
  if (!conversation.source?.sid) return null;
  const task = TaskHelper.getTaskFromConversationSid(conversation.source?.sid);
  if (!task || !TaskHelper.isCBMTask(task)) return null;

  const { flexInteractionSid = '', flexInteractionChannelSid = '', conversationSid = '' } = task.attributes;

  const participants = await task.getParticipants(flexInteractionChannelSid);

  const flexInteractionParticipantSid = _getMyParticipantSid(participants);

  if (!flexInteractionParticipantSid) return null;

  return {
    flexInteractionSid,
    flexInteractionChannelSid,
    flexInteractionParticipantSid,
    conversationSid,
  };
};

export const buildRemovePartiticipantAPIPayload = (task: ITask, flexInteractionParticipantSid: string) => {
  if (!task || !TaskHelper.isCBMTask(task)) return null;

  const { flexInteractionSid = '', flexInteractionChannelSid = '', conversationSid = '' } = task.attributes;

  if (!flexInteractionParticipantSid) return null;

  return {
    flexInteractionSid,
    flexInteractionChannelSid,
    flexInteractionParticipantSid,
    conversationSid,
  };
};

export const buildInviteParticipantAPIPayload = async (
  task: ITask,
  targetSid: string,
  removeInvitingAgent: boolean,
): Promise<TransferRESTPayload | null> => {
  const { taskSid } = task;
  const conversationId = task.attributes?.conversations?.conversation_id || task.taskSid;
  const jsonAttributes = JSON.stringify(task.attributes);
  const transferTargetSid = targetSid;

  let transferQueueName = '';
  let transferWorkerName = '';
  if (transferTargetSid.startsWith('WQ')) {
    transferQueueName = await _queueNameFromSid(transferTargetSid);
    if (!transferQueueName) {
      console.error('Transfer failed. queueNameFromSid failed for', transferTargetSid);
      return null;
    }
  } else {
    transferWorkerName = await getWorkerName(transferTargetSid);
  }

  const { flexInteractionSid = null, flexInteractionChannelSid = null, conversationSid = null } = task.attributes;

  if (!flexInteractionSid || !flexInteractionChannelSid) {
    console.error('Transfer failed. Missing flexInteractionSid or flexInteractionChannelSid', task.sid);
    return null;
  }

  const participants = await task.getParticipants(flexInteractionChannelSid);

  const workerSidsInConversationArray = _getAgentsWorkerSidArray(participants);
  const workersToIgnore = {
    workerSidsInConversation: workerSidsInConversationArray,
  };

  let removeFlexInteractionParticipantSid = '';
  if (removeInvitingAgent) {
    removeFlexInteractionParticipantSid = _getMyParticipantSid(participants) || '';

    if (!removeFlexInteractionParticipantSid) {
      console.error("Transfer failed. Didn't find flexInteractionPartipantSid", task.sid);
      return null;
    }
  }

  return {
    taskSid,
    conversationId,
    conversationSid,
    jsonAttributes,
    transferTargetSid,
    transferQueueName,
    transferWorkerName,
    workersToIgnore,
    flexInteractionSid,
    flexInteractionChannelSid,
    removeFlexInteractionParticipantSid,
  };
};

export interface TransferRESTResponse {
  success: boolean;
  invitesTaskSid: string;
}

export interface RemoveParticipantRESTResponse {
  success: boolean;
}

class ChatTransferService extends ApiService {
  sendTransferChatAPIRequest = async (requestPayload: TransferRESTPayload): Promise<TransferRESTResponse> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(manager.user.token),
      taskSid: encodeURIComponent(requestPayload.taskSid),
      conversationId: encodeURIComponent(requestPayload.conversationId),
      conversationSid: encodeURIComponent(requestPayload.conversationSid),
      jsonAttributes: encodeURIComponent(requestPayload.jsonAttributes),
      transferTargetSid: encodeURIComponent(requestPayload.transferTargetSid),
      transferQueueName: encodeURIComponent(requestPayload.transferQueueName),
      transferWorkerName: encodeURIComponent(requestPayload.transferWorkerName),
      workersToIgnore: encodeURIComponent(JSON.stringify(requestPayload.workersToIgnore)),
      flexInteractionSid: encodeURIComponent(requestPayload.flexInteractionSid),
      flexInteractionChannelSid: encodeURIComponent(requestPayload.flexInteractionChannelSid),
      removeFlexInteractionParticipantSid: encodeURIComponent(requestPayload.removeFlexInteractionParticipantSid),
    };

    return this.fetchJsonWithReject<TransferRESTResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/features/conversation-transfer/flex/invite-participant`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    ).then((response): TransferRESTResponse => {
      return {
        ...response,
      };
    });
  };

  removeParticipantAPIRequest = async (
    requestPayload: RemoveParticipantRESTPayload,
  ): Promise<RemoveParticipantRESTResponse> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(manager.user.token),
      conversationSid: encodeURIComponent(requestPayload.conversationSid),
      flexInteractionSid: encodeURIComponent(requestPayload.flexInteractionSid),
      flexInteractionChannelSid: encodeURIComponent(requestPayload.flexInteractionChannelSid),
      flexInteractionParticipantSid: encodeURIComponent(requestPayload.flexInteractionParticipantSid),
    };

    return this.fetchJsonWithReject<TransferRESTResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/features/conversation-transfer/flex/remove-participant`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    ).then((response): TransferRESTResponse => {
      return {
        ...response,
      };
    });
  };
}

export default new ChatTransferService();
