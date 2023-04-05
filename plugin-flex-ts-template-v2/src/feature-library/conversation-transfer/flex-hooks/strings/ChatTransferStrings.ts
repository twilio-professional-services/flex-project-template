// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ChatTransferTaskSuccess = 'ChatTransferTaskSuccess',
  ChatTransferFailedGeneric = 'ChatTransferFailedGeneric',
  ChatTransferFailedConsultNotSupported = 'ChatTransferFailedConsultNotSupported',
  ChatParticipantInvited = 'ChatParticipantInvited',
  ChatRemoveParticipantFailed = 'ChatRemoveParticipantFailed',
  ChatRemoveParticipantSuccess = 'ChatRemoveParticipantSuccess',
  ChatCancelParticipantInviteFailed = 'ChatCancelParticipantInviteFailed',
  ChatCancelParticipantInviteSuccess = 'ChatCancelParticipantInviteSuccess',
  ChatParticipantInviteOutstanding = 'ChatParticipantInviteOutstanding',
}

export const stringHook = () => ({
  [StringTemplates.ChatTransferTaskSuccess]: 'Conversation transferred',
  [StringTemplates.ChatParticipantInvited]: 'Participant invited',
  [StringTemplates.ChatTransferFailedGeneric]: 'Error occured adding new participant',
  [StringTemplates.ChatTransferFailedConsultNotSupported]: 'Consult/Warm transfer is not supported',
  [StringTemplates.ChatRemoveParticipantFailed]: 'Participant remove failed',
  [StringTemplates.ChatRemoveParticipantSuccess]: 'Participant removed',
  [StringTemplates.ChatCancelParticipantInviteFailed]: 'Participant invite cancel failed',
  [StringTemplates.ChatCancelParticipantInviteSuccess]: 'Participant invite canceled',
  [StringTemplates.ChatParticipantInviteOutstanding]:
    'Inviting Participant Failed. There is already an outstanding invite for the chat',
});
