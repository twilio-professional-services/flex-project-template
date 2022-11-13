import * as Flex from '@twilio/flex-ui';
import ChatTransferService from '../../utils/serverless/ChatTransferService';
import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled } = custom_data.features.chat_transfer;

export interface EventPayload {
  task?: Flex.ITask;
  sid?: string;
}

// when a chat task has been transferred, performs custom complete actions
// otherwise performs default behaviors
export const interceptTransferredChatTasks = async (flex: typeof Flex, manager: Flex.Manager) => {

  if(!enabled) return;

  Flex.Actions.addListener('beforeCompleteTask', async (payload, abortFunction) => {

    const task = payload.task ? payload.task : Flex.TaskHelper.getTaskByTaskSid(payload.sid as string);

    // for any tasks that are not chat transfer tasks, complete as normal
    if (!(Flex.TaskHelper.isChatBasedTask(task) && task.attributes.chatTransferData)) {
      return;
    }

    // perform custom complete activities for chat tasks that have been transferred.
    // then abort performing any other OOTB actions for completing this task
    const success = await ChatTransferService.completeTransferredTask(task);
    if (success) abortFunction();
  });
}
