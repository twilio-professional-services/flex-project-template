import { ParticipantInviteType } from "./ParticipantInvite"

export interface InvitedParticipantDetails {
  invitesTaskSid: string;
  targetSid: string;
  targetName: string;
  timestampCreated: Date;
  inviteTargetType: ParticipantInviteType;
}
