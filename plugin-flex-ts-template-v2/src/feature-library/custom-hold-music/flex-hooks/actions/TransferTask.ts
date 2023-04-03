import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.TransferTask;
export const actionHook = function setHoldMusicBeforeTransferTask(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, _abortFunction) => {
    if (!Flex.TaskHelper.isCallTask(payload.task ?? Flex.TaskHelper.getTaskByTaskSid(payload.sid))) {
      return;
    }

    // By default, TaskRouter will hold participants when initiating a transfer.
    // Doing it beforehand here allows us to provide our custom hold music.
    await flex.Actions.invokeAction('HoldCall', payload);
  });
};
