import * as Flex from '@twilio/flex-ui';

import ConferenceService from '../../utils/ConferenceService';
import { isAddButtonEnabled } from '../../config';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.UnholdParticipant;
export const actionHook = function handleUnholdConferenceParticipant(flex: typeof Flex, _manager: Flex.Manager) {
  if (!isAddButtonEnabled()) return;

  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    const { participantType, targetSid: participantSid, task } = payload;

    if (participantType !== 'unknown') {
      return;
    }

    console.log('Unholding participant', participantSid);

    const conferenceSid = task.conference?.conferenceSid;
    abortFunction();
    await ConferenceService.unholdParticipant(conferenceSid, participantSid);
  });
};
