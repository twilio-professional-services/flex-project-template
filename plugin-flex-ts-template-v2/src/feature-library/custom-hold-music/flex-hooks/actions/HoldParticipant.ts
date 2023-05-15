import * as Flex from '@twilio/flex-ui';

import { getHoldMusicUrl } from '../../config';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.HoldParticipant;
export const actionHook = function setHoldMusicBeforeHoldParticipant(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, _abortFunction) => {
    payload.holdMusicUrl = getHoldMusicUrl();
  });
};
