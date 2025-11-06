import * as Flex from '@twilio/flex-ui';

import { isInternalCall } from '../../helpers/internalCall';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.AcceptTask;
export const actionHook = function handleInternalAcceptTask(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    if (!isInternalCall(payload.task) || payload.task.incomingTransferObject) {
      return;
    }

    payload.conferenceOptions = {
      endConferenceOnCustomerExit: false,
      endConferenceOnExit: true
    };
  });
};
