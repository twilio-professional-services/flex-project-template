import * as Flex from "@twilio/flex-ui";
import ConferenceService from "../../utils/ConferenceService";
import { isAddButtonEnabled } from '../..';

export function handleHoldConferenceParticipant(flex: typeof Flex, manager: Flex.Manager) {
  if (!isAddButtonEnabled()) return;

  flex.Actions.addListener("beforeHoldParticipant", async (payload, abortFunction) => {
    const { participantType, targetSid: participantSid, task } = payload;
    
    if (participantType !== 'unknown') {
      return;
    }
    
    const conferenceSid = task.conference?.conferenceSid;
    abortFunction();
    console.log('Holding participant', participantSid);
    await ConferenceService.holdParticipant(conferenceSid, participantSid);
  });
}
