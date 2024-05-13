export type ParticipantType = 'agent' | 'worker' | 'supervisor' | 'customer';

export interface ParticipantDetails {
  friendlyName: string;
  participantType: ParticipantType;
  isMe: boolean;
  interactionParticipantSid: string;
  conversationMemberSid: string;
}
