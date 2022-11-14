import * as Flex from '@twilio/flex-ui';

import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled } = custom_data.features.chat_transfer;

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

// if the task channel is not chat, function defers to existing process
// otherwise the function creates a new task for transfering the chat
// and deals with the chat orchestration
export function interceptTransferOverrideForChatTasks(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;

  Flex.Actions.addListener('beforeTransferTask', (payload: EventPayload, abortFunction: any) => {
    if (Flex.TaskHelper.isChatBasedTask(payload.task)) {
      abortFunction(payload);
      // Execute Chat Transfer Task
      Flex.Actions.invokeAction('chatTransferTask', payload);
    }
  });
}
