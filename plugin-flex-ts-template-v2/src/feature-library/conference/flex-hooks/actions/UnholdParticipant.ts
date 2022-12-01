import * as Flex from "@twilio/flex-ui";
import ConferenceService from "../../utils/ConferenceService";
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false, add_button = true } = getFeatureFlags().features?.conference || {};

export function handleUnholdConferenceParticipant(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!enabled || !add_button) return;

  flex.Actions.addListener(
    "beforeUnholdParticipant",
    async (payload, abortFunction) => {
      const { participantType, targetSid: participantSid, task } = payload;

      if (participantType !== "unknown") {
        return;
      }

      console.log("Unholding participant", participantSid);

      const conferenceSid = task.conference?.conferenceSid;
      abortFunction();
      await ConferenceService.unholdParticipant(conferenceSid, participantSid);
    }
  );
}
