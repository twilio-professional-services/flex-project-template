export type ParticipantInviteType = 'Worker' | 'Queue';

export type ParticipantType = 'agent' | 'worker';

export interface WorkerParticipantInvite {
  full_name: string;
  activity_name: string;
  worker_sid: string;
  available: boolean;
}

export interface QueueParticipantInvite {
  queue_name: string;
  queue_sid: string;
}

export interface ParticipantInvite {
  type: ParticipantInviteType;
  participant: WorkerParticipantInvite | QueueParticipantInvite | null;
}

export interface InvitedParticipantDetails {
  invitesTaskSid: string;
  targetSid: string;
  targetName: string;
  timestampCreated: Date;
  inviteTargetType: ParticipantInviteType;
}

export interface InvitedParticipants {
  invites: (InvitedParticipantDetails | undefined)[];
}

export interface ParticipantDetails {
  friendlyName: string;
  participantType: ParticipantType;
  isMe: boolean;
  interactionParticipantSid: string;
  conversationMemberSid: string;
}
