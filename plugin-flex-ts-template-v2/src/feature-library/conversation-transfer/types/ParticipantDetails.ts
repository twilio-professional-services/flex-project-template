export type ParticipantType = 'agent' | 'worker' | 'supervisor';

export interface ParticipantDetails {
  friendlyName: string;
  participantType: ParticipantType;
  isMe: boolean;
  interactionParticipantSid: string;
  conversationMemberSid: string;
}
