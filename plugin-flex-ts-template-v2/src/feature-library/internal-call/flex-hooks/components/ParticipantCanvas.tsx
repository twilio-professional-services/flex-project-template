import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "types/manager/ServiceConfiguration";
import { isInternalCall } from '../../helpers/internalCall';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled = false } = custom_data?.features?.internal_call || {};

export function removeFromCanvasForInternalCall(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;
  
  const hideParticipant = (props: any) => isInternalCall(props.task) && props.participant.participantType === "customer" ;
  const hideKick = (props: any) => isInternalCall(props.task) && props.participant.participantType === "transfer" ;
  
  flex.ParticipantCanvas.Content.remove('avatar', { if: hideParticipant });
  flex.ParticipantCanvas.Content.remove('avatar-hover', { if: hideParticipant });
  flex.ParticipantCanvas.Content.remove('name', { if: hideParticipant });
  flex.ParticipantCanvas.Content.remove('status', { if: hideParticipant });
  flex.ParticipantCanvas.Content.remove('actions', { if: hideParticipant });
  
  flex.ParticipantCanvas.Actions.Content.remove('cancel-transfer', { if: hideKick });
  flex.ParticipantCanvas.Actions.Content.remove('kick', { if: hideKick });
  
  flex.ParticipantCanvas.ListItem.Content.remove('avatar', { if: hideParticipant });
  flex.ParticipantCanvas.ListItem.Content.remove('avatar-hover', { if: hideParticipant });
  flex.ParticipantCanvas.ListItem.Content.remove('statusContainer', { if: hideParticipant });
  flex.ParticipantCanvas.ListItem.Content.remove('actions', { if: hideParticipant });
}