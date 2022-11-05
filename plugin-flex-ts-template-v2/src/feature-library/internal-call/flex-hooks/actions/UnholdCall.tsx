import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "types/manager/ServiceConfiguration";
import ConferenceService from "../../../conference/utils/ConferenceService";
import { isInternalCall } from '../../helpers/internalCall';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled } = custom_data?.features?.internal_call || {};

export function handleInternalUnholdCall(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;

  flex.Actions.addListener("beforeUnholdCall", async (payload: any, abortFunction: () => void) => {
    if (!isInternalCall(payload.task)) {
      return;
    }
    
    const { task } = payload;
    const conference = task.attributes.conference
      ? task.attributes.conference.sid
      : task.attributes.conferenceSid;
    
    const participant = task.attributes.conference.participants
      ? task.attributes.conference.participants.worker
      : task.attributes.worker_call_sid;
    
    await ConferenceService.unholdParticipant(conference, participant);
    abortFunction();
  });
}
