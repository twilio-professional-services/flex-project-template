import * as Flex from '@twilio/flex-ui';

import ChatTransferService from '../../utils/serverless/ChatTransferService';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export interface TransferOptions {
  attributes: string;
  mode: string;
  priority: string;
}

export interface EventPayload {
  task: Flex.ITask;
  sid?: string; // taskSid or task is required
  targetSid: string; // target of worker or queue sid
  options?: TransferOptions;
}

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.TransferTask;
// if the task channel is not chat, function defers to existing process
// otherwise the function creates a new task for transfering the chat
// and deals with the chat orchestration
export const actionHook = function interceptTransferOverrideForChatTasks(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload: EventPayload, abortFunction: any) => {
    if (Flex.TaskHelper.isChatBasedTask(payload.task) && !Flex.TaskHelper.isCBMTask(payload.task)) {
      abortFunction(payload);
      // Execute Chat Transfer Task
      await ChatTransferService.executeChatTransfer(payload.task, payload.targetSid, payload.options);
    }
  });
};
