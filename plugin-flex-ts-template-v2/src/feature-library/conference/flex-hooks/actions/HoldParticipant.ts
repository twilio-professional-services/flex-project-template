import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "types/manager/ServiceConfiguration";
import ConferenceService from "../../utils/ConferenceService";

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled = false, add_button = true } = custom_data?.features.conference || {};

export function handleHoldConferenceParticipant(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled || !add_button) return;

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
