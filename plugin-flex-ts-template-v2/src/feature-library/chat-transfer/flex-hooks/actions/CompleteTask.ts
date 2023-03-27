import * as Flex from '@twilio/flex-ui';

import ChatTransferService from '../../utils/serverless/ChatTransferService';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export interface EventPayload {
  task?: Flex.ITask;
  sid?: string;
}

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.CompleteTask;
// when a chat task has been transferred, performs custom complete actions
// otherwise performs default behaviors
export const actionHook = async function interceptTransferredChatTasks(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    const task = payload.task ? payload.task : Flex.TaskHelper.getTaskByTaskSid(payload.sid as string);

    // for any tasks that are not chat transfer tasks, complete as normal
    if (!task.attributes.chatTransferData) {
      return;
    }

    // perform custom complete activities for chat tasks that have been transferred.
    // then abort performing any other OOTB actions for completing this task
    const success = await ChatTransferService.completeTransferredTask(task);
    if (success) abortFunction();
  });
};
