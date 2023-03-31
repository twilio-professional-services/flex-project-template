export type ParticipantType = 'agent' | 'worker';

export interface ParticipantDetails {
  friendlyName: string;
  participantType: ParticipantType;
  isMe: boolean;
  interactionParticipantSid: string;
  conversationMemberSid: string;
}
