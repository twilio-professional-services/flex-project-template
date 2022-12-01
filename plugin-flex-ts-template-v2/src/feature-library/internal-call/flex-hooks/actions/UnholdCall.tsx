import * as Flex from "@twilio/flex-ui";
import ConferenceService from "../../../conference/utils/ConferenceService";
import { isInternalCall } from '../../helpers/internalCall';
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.internal_call || {};

export function handleInternalUnholdCall(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;

  flex.Actions.addListener("beforeUnholdCall", async (payload, abortFunction) => {
    if (!isInternalCall(payload.task)) {
      return;
    }
    
    const { task } = payload;
    const conference = task.conference
      ? task.conference.conferenceSid
      : task.attributes.conferenceSid;
    
    const participant = task.attributes.conference.participants
      ? task.attributes.conference.participants.worker
      : task.attributes.worker_call_sid;
    
    await ConferenceService.unholdParticipant(conference, participant);
    abortFunction();
  });
}
