import * as Flex from '@twilio/flex-ui';

import ConferenceService from '../../utils/ConferenceService';
import { isConferenceEnabledWithoutNativeXWT } from '../../config';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.HoldParticipant;
export const actionHook = function handleHoldConferenceParticipant(flex: typeof Flex, _manager: Flex.Manager) {
  if (!isConferenceEnabledWithoutNativeXWT()) return;

  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    const { participantType, targetSid: participantSid, task } = payload;

    if (participantType !== 'unknown') {
      return;
    }

    const conferenceSid = task.conference?.conferenceSid;
    abortFunction();
    console.log('Holding participant', participantSid);
    await ConferenceService.holdParticipant(conferenceSid, participantSid);
  });
};
