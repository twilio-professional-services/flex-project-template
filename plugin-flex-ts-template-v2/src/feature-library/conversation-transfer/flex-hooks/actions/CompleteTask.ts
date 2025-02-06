import * as Flex from '@twilio/flex-ui';

import { isColdTransferEnabled, isMultiParticipantEnabled } from '../../config';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.CompleteTask;
// invoke the custom LeaveChat action if a cbm task otherwise carry on
export const actionHook = function handleConvTransferComplete(flex: typeof Flex, manager: Flex.Manager) {
  if (!isColdTransferEnabled() && !isMultiParticipantEnabled()) return;

  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    // This should be in Actions.replaceAction("CompleteTask")
    const { task } = payload;
    if (!flex.TaskHelper.isCBMTask(task)) {
      return;
    }

    const conversation = flex.StateHelper.getConversationStateForTask(task);
    if (!conversation) {
      return;
    }

    await flex.Actions.invokeAction('LeaveChat', {
      conversation,
    });

    abortFunction();
  });
};
