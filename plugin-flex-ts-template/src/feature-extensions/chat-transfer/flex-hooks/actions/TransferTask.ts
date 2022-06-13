import * as Flex from '@twilio/flex-ui';

import ChatTransferService from '../../utils/serverless/ChatTransferService';

export interface TransferOptions {
  attributes: string,
  mode: string,
  priority: string
}

export interface EventPayload {
  task: Flex.ITask,
  sid?: string, // taskSid or task is required
  targetSid: string, // target of worker or queue sid
  options?: TransferOptions
}

// if the task channel is not chat, function defers to existing process
// otherwise the function creates a new task for transfering the chat
// and deals with the chat orchestration
export function transferOverrideForChatTasks(flex: typeof Flex, manager: Flex.Manager) {
  Flex.Actions.replaceAction('TransferTask', async (payload: EventPayload, original: any) => {

    if (!Flex.TaskHelper.isChatBasedTask(payload.task)) {
      return original(payload);
    }
  
    // Execute Chat Transfer Task
    await ChatTransferService.executeChatTransfer(payload.task, payload.targetSid, payload.options);

  })
}
