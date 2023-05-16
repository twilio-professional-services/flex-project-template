import * as Flex from '@twilio/flex-ui';

import { isColdTransferEnabled, isMultiParticipantEnabled } from '../../config';
import { TransferActionPayload } from '../../types/ActionPayloads';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.TransferTask;
// invoke the custom chatTransferTask action if a cbm task otherwise carry on
export const actionHook = function handleConvTransfer(flex: typeof Flex, _manager: Flex.Manager) {
  if (!isColdTransferEnabled() && !isMultiParticipantEnabled()) return;

  flex.Actions.addListener(`${actionEvent}${actionName}`, (payload: TransferActionPayload, abortFunction: any) => {
    if (flex.TaskHelper.isCBMTask(payload.task)) {
      // native action handler would fail for chat task so abort the action
      abortFunction();
      // Execute Chat Transfer Task
      flex.Actions.invokeAction('ChatTransferTask', payload);
    }
  });
};
