import * as Flex from '@twilio/flex-ui';
import { ITask } from '@twilio/flex-ui';

import { ParticipantDetails } from '../../types/ParticipantDetails';
import { InvitedParticipantDetails, InvitedParticipants } from '../../types/InvitedParticipantDetails';
import { ConversationState } from '../../../../types/conversations';

const manager = Flex.Manager.getInstance();

// check that the members of the conversation match the participant details
const participantDetailsUpToDateCheck = (
  conversation: ConversationState,
  participantDetails: ParticipantDetails[],
): boolean => {
  if (!conversation?.participants || !participantDetails) return false;

  const conversationMemberSids = Array.from(conversation?.participants.values()).map(
    (participant) => participant.source.sid,
  );

  const participantDetailsMemberSids = participantDetails.map((participant) => participant.conversationMemberSid);

  return (
    conversationMemberSids.length === participantDetailsMemberSids.length &&
    conversationMemberSids.every((val) => conversationMemberSids.includes(val))
  );
};

// There can be a delay in the media properties being up to date for participants joining
const getCBMParticipantsWrapper = async (task: ITask, flexInteractionChannelSid: string): Promise<any[]> => {
  const wait = async (ms: number) =>
    new Promise<void>((resolve) => {
      setTimeout(() => resolve(), ms);
    });

  let retry = 0;
  let retryTimer = 500;
  while (retry < 5) {
    const participants = await task.getParticipants(flexInteractionChannelSid);
    let missingMediaProperties = false;

    participants.forEach((participant: any) => {
      if (!participant?.mediaProperties) missingMediaProperties = true;
    });

    if (!missingMediaProperties) return participants;
    retry += 1;
    console.log('getCBMParticipantsWrapper retry', retry);
    wait(retryTimer);
    retryTimer *= 2;
  }

  return [];
};

// we use a mix of conversation participants (MBxxx sids) and Interactions Participants (UTxxx) to build what we need
export const getUpdatedParticipantDetails = async (
  task: Flex.ITask,
  conversation: ConversationState,
  participantDetails: ParticipantDetails[],
) => {
  const myIdentity = manager.conversationsClient?.user?.identity;

  const flexInteractionChannelSid = task?.attributes?.flexInteractionChannelSid;
  if (!flexInteractionChannelSid) return [];

  // check if our current participantsDetails is up to date compared to conversations.
  // if not and conversations member has been added/removed make a request to fetch the participants
  // getParticipants makes a request to twilio via sdk so lets limit this to only call when we need to find a new members details
  // note we do have the participants in the redux store but at the time of writing it isn't always up to date

  if (participantDetailsUpToDateCheck(conversation, participantDetails)) return participantDetails;

  const participants: ParticipantDetails[] = [];

  const intertactionParticipants: any[] = await getCBMParticipantsWrapper(task, flexInteractionChannelSid);

  if (!intertactionParticipants || !conversation?.participants) return participantDetails;

  const conversationParticipants = Array.from(conversation?.participants.values());

  console.log('getParticipantDetails', conversationParticipants, intertactionParticipants);

  conversationParticipants.forEach((conversationParticipant) => {
    const intertactionParticipant = intertactionParticipants.find(
      (participant) => participant.mediaProperties?.sid === conversationParticipant.source.sid,
    );

    if (intertactionParticipant) {
      const friendlyName =
        conversationParticipant.friendlyName || intertactionParticipant.mediaProperties?.messagingBinding.address;
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

export const getUpdatedInvitedParticipantDetails = (conversation: ConversationState) => {
  const { invites = undefined } = (conversation?.source?.attributes as any as InvitedParticipants) || {};

  if (!invites) return [];

  const invitedParticipantsDetails: InvitedParticipantDetails[] = [];

  Object.entries(invites).forEach(([_key, value]) => {
    const invitedParticipantDetails = value as InvitedParticipantDetails;
    invitedParticipantsDetails.push(invitedParticipantDetails);
  });

  return invitedParticipantsDetails;
};
