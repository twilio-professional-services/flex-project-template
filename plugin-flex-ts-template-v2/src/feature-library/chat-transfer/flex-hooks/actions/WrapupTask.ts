import * as Flex from '@twilio/flex-ui';
import { TaskHelper } from '@twilio/flex-ui';
import { Worker } from 'types/task-router';

import { getWorkerFriendlyName } from '../../utils/serverless/ChatTransferService';
import TaskService from '../../../../utils/serverless/TaskRouter/TaskRouterService';
import ProgrammableChatService from '../../../../utils/serverless/ProgrammableChat/ProgrammableChatService';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import { StringTemplates } from '../strings/ChatTransfer';

export interface MessageAttributes {
  senderInfo: { type: string; name: string };
  notification: boolean;
}

// for a given chat task, mark the task sid
// on the associated chat channel attributes as complete
const notifyChatChannelTaskComplete = async (task: Flex.ITask, manager: Flex.Manager) => {
  const { channelSid } = task.attributes;
  const chatChannel = await manager.conversationsClient.getConversationBySid(channelSid);
  const chatAttributes = chatChannel.attributes as any;
  const associatedTasks = chatAttributes.associatedTasks || {};
  associatedTasks[task.taskSid] = 'completed';
  const newChatAttributes = {
    ...chatAttributes,
    associatedTasks,
  };

  await ProgrammableChatService.updateChannelAttributes(channelSid, newChatAttributes);
};

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.WrapupTask;
export const actionHook = async function announceOnChannelWhenLeavingAndRemoveChannelSidAndLeaveChatForChatTransfer(
  flex: typeof Flex,
  manager: Flex.Manager,
) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, _abortFunction) => {
    // ensure reference to task and we are wrapping up a chat task
    const task = payload.task || TaskHelper.getTaskByTaskSid(payload.sid || '');
    if (task.taskChannelUniqueName !== 'chat' || Flex.TaskHelper.isCBMTask(payload.task)) return;

    // make sure we have a channel sid
    const { channelSid, chatTransferData } = task.attributes;
    if (channelSid) {
      await Flex.Actions.invokeAction('SendMessage', {
        conversationSid: channelSid,
        body: flex.templates[StringTemplates.LeaveMessage]({
          workerName: getWorkerFriendlyName(manager.workerClient as unknown as Worker),
        }),
        messageAttributes: { notification: true },
      });

      // identifies tasks at wrapup that are of type chat and orchestrates
      // removing the agent from the chat channel then removes the channel
      // sid from the task attributes.
      //
      // Failure to remove channelsid will result in the channel janitor
      // deactivating the chat if the channel janitor is turned on
      // https://www.twilio.com/docs/flex/developer/messaging/manage-flows#channel-janitor

      // if we are performing a transfer, we need to remove the channelSid
      // just before wrapup or the channel janitor will deactivate the channel
      const newChannelSid = chatTransferData ? null : channelSid;

      // if we are removing the channelsid,
      // we need to remove the member from the chat
      // channel first or the orchestrator wont be able to do it later.
      if (!newChannelSid) await Flex.ChatOrchestrator.orchestrateCompleteTask(task);

      const attributesUpdate = {
        channelSid: newChannelSid,
      };

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
};
