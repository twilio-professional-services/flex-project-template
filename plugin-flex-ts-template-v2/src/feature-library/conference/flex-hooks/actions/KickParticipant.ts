import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "types/manager/ServiceConfiguration";
import ConferenceService from "../../utils/ConferenceService";

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled = false } = custom_data?.features.conference || {};

export function handleKickConferenceParticipant(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;

  flex.Actions.addListener("beforeKickParticipant", async (payload, abortFunction) => {
    const { participantType } = payload;

    if (participantType && participantType !== "transfer" && participantType !== "external" && participantType !== "worker") {
      abortFunction();

      const { task, targetSid } = payload;

      const conference = task.conference?.conferenceSid;

      const participantSid = targetSid;

      console.log(`Removing participant ${participantSid} from conference`);
      await ConferenceService.removeParticipant(conference, participantSid);
    }
  });
}
