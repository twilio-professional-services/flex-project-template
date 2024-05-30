import * as Flex from '@twilio/flex-ui';

import InternalCallService from '../../helpers/InternalCallService';
import { isInternalCall } from '../../helpers/internalCall';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.RejectTask;
export const actionHook = function handleInternalRejectTask(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    if (!isInternalCall(payload.task)) {
      return;
    }

    await InternalCallService.rejectInternalTask(payload.task);
  });
};
