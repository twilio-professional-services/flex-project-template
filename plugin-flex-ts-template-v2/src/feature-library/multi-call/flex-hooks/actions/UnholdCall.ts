import * as Flex from '@twilio/flex-ui';

import { handleUnhold } from '../../helpers/MultiCallHelper';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.UnholdCall;
export const actionHook = function handleMultiCallUnholdCall(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, _abortFunction) => {
    handleUnhold(payload);
  });
};
