import * as Flex from '@twilio/flex-ui';
import { TaskHelper } from '@twilio/flex-ui'
import { getWorkerFriendlyName }  from '../../utils/serverless/ChatTransferService';
import TaskService from '../../../../utils/serverless/TaskRouter/TaskRouterService';
import ProgrammableChatService from '../../../../utils/serverless/ProgrammableChat/ProgrammableChatService';

import { UIAttributes } from 'types/manager/ServiceConfiguration';
import { Worker } from 'types/task-router';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled } = custom_data.features.chat_transfer;


export interface MessageAttributes {
  senderInfo: {type: string, name: string},
  notification: boolean
}

export const announceOnChannelWhenLeaving = async (flex: typeof Flex, manager: Flex.Manager) => {

  if(!enabled) return;

  Flex.Actions.addListener('beforeWrapupTask', async (payload, abortFunction) => {

    // ensure reference to task and we are wrapping up a chat task
    const task = payload.task || TaskHelper.getTaskByTaskSid(payload.sid || "");
    if (task.taskChannelUniqueName !== 'chat') return;

    // make sure we have a channel sid
    const { channelSid } = task.attributes;
    if (channelSid) {
      await Flex.Actions.invokeAction('SendMessage', {
        channelSid,
        body: `${getWorkerFriendlyName(manager.workerClient as unknown as Worker)} left the channel`,
        messageAttributes: { notification: true }
      });
    }
  });
}

// identifys tasks at wrapup that are of type chat and orchestrates
// removing the agent from the chat channel then removes the channel
// sid from the task attributes.
//
// Failure to remove channelsid will result in the channel janitor 
// deactivating the chat if the channel janitor is turned on
// https://www.twilio.com/docs/flex/developer/messaging/manage-flows#channel-janitor
export const removeChannelSidAndLeaveChatForChatTransfer = async (flex: typeof Flex, manager: Flex.Manager) => {

  if(!enabled) return;

  Flex.Actions.addListener('beforeWrapupTask', async (payload, abortFunction) => {

    const task = payload.task || TaskHelper.getTaskByTaskSid(payload.sid || "");
    if (task.taskChannelUniqueName !== 'chat') return;

    const { channelSid, chatTransferData } = task.attributes;
    if (channelSid) {

      // if we are performing a transfer, we need to remove the channelSid
      // just before wrapup or the channel janitor will deactivate the channel
      const newChannelSid = chatTransferData ? null : channelSid

      // if we are removing the channelsid, 
      // we need to remove the member from the chat
      // channel first or the orhcestrator wont be able to do it later.
      if (!newChannelSid) await Flex.ChatOrchestrator.orchestrateCompleteTask(task);

      const attributesUpdate = {
        channelSid: newChannelSid,
      }

      // before we remove any chat channel sids we need to
      // notify the chat channel the tasks are complete
      try {
        await notifyChatChannelTaskComplete(task, manager);
      } catch (e) {
        console.warn(`Unable to update chat channel that task is complete: ${task.taskSid} and ${channelSid}`);
      }
      await TaskService.updateTaskAttributes(task.taskSid, attributesUpdate);
    }
  });
}

// for a given chat task, mark the task sid
// on the associated chat channel attributes as complete
const notifyChatChannelTaskComplete = async (task: Flex.ITask, manager: Flex.Manager) => {

  if(!enabled) return;
  
  const { channelSid } = task.attributes;
  const chatChannel = await manager.chatClient.getChannelBySid(channelSid);
  const chatAttributes = chatChannel.attributes as any;
  let associatedTasks = chatAttributes.associatedTasks || {};
  associatedTasks[task.taskSid] = "completed";
  const newChatAttributes = {
    ...chatAttributes,
    associatedTasks
  }

  await ProgrammableChatService.updateChannelAttributes(channelSid, newChatAttributes);
}


