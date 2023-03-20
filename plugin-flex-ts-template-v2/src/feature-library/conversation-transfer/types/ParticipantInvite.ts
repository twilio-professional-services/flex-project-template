export type ParticipantInviteType = 'Worker' | 'Queue';

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
