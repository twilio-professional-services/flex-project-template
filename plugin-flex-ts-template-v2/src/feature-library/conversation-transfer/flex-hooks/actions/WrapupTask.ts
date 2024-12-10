import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import { AppState } from '../../../../types/manager';
import { ConversationTransferState } from '../states';
import { reduxNamespace } from '../../../../utils/state';
import { NotificationIds } from '../notifications/TransferResult';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.WrapupTask;
export const actionHook = function preventWrapupForPendingTransfer(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    let task = payload.task;
    if (!task && payload.sid) {
      task = Flex.TaskHelper.getTaskByTaskSid(payload.sid);
    }
    if (!task) {
      return;
    }

    if (!Flex.TaskHelper.isCBMTask(payload.task)) {
      return;
    }

    const state = manager.store.getState() as AppState;
    const index = (state[reduxNamespace].conversationTransfer as ConversationTransferState).pendingTransfers.findIndex(
      (sid) => sid === task.sid,
    );

    if (index >= 0) {
      Flex.Notifications.showNotification(NotificationIds.TransferPendingError);
      abortFunction();
    }
  });
};
