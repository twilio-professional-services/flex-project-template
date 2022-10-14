import * as Flex from "@twilio/flex-ui";
import { ConversationState } from "@twilio/flex-ui";
import { ChatProperties } from "@twilio/flex-ui/src/state/Participants/participants.types";
import { ParticipantDetails } from "../../types/ParticipantDetails";

const manager = Flex.Manager.getInstance();

export const getParticipantDetails = (
  conversation: ConversationState.ConversationState
) => {
  // we use a mix of conversation (MBxxx sids) and Interactions Participants (UTxxx) to build what we need
  const myIdentity = manager.user.identity;
  const flexState = manager.store.getState().flex;

  const participants: ParticipantDetails[] = [];

  const conversationParticipants = Array.from(
    conversation?.participants.values()
  );
  const intertactionParticipants = Object.values(flexState.participants.bySid);

  conversationParticipants.forEach((conversationParticipant) => {
    const intertactionParticipant = intertactionParticipants.find(
      (participant) =>
        (participant.mediaProperties as ChatProperties).sid ==
        conversationParticipant.source.sid
    );

    if (intertactionParticipant) {
      const friendlyName =
        conversationParticipant.friendlyName ||
        (intertactionParticipant.mediaProperties as ChatProperties)
          .messagingBinding.address;
      const participantType = intertactionParticipant.type;
      const isMe = conversationParticipant.source.identity === myIdentity;
      const interactionParticipantSid = intertactionParticipant.participantSid;
      const conversationMemberSid = conversationParticipant.source.sid;

      participants.push({
        friendlyName,
        participantType,
        isMe,
        interactionParticipantSid,
        conversationMemberSid,
      });
    }
  });

  return participants;
};
