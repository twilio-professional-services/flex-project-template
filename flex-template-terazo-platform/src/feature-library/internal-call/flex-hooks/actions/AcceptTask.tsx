import * as Flex from '@twilio/flex-ui';

import InternalCallService from '../../helpers/InternalCallService';
import { isInternalCall } from '../../helpers/internalCall';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.AcceptTask;
export const actionHook = function handleInternalAcceptTask(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    if (!isInternalCall(payload.task)) {
      return;
    }

    abortFunction();
    await InternalCallService.acceptInternalTask(payload.task.sourceObject, payload.task.taskSid);
  });
};
