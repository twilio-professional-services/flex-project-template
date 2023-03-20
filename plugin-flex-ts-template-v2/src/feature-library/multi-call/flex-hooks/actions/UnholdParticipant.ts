import * as Flex from '@twilio/flex-ui';

import { handleUnhold } from '../../helpers/MultiCallHelper';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.UnHoldParticipant;
export const actionHook = function handleMultiCallUnholdParticipant(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    handleUnhold(payload);
  });
};
