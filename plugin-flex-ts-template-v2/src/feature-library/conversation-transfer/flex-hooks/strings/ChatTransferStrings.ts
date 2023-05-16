// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ChatTransferTaskSuccess = 'ChatTransferTaskSuccess',
  ChatTransferFailedGeneric = 'ChatTransferFailedGeneric',
  ChatTransferFailedConsultNotSupported = 'ChatTransferFailedConsultNotSupported',
  ChatTransferFailedColdNotSupported = 'ChatTransferFailedColdNotSupported',
  ChatTransferFailedAlreadyParticipating = 'ChatTransferFailedAlreadyParticipating',
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
  [StringTemplates.ChatTransferFailedConsultNotSupported]: 'Consult/warm transfer is not enabled',
  [StringTemplates.ChatTransferFailedColdNotSupported]: 'Cold transfer is not enabled',
  [StringTemplates.ChatTransferFailedAlreadyParticipating]:
    'The selected target is already a participant in the conversation',
  [StringTemplates.ChatRemoveParticipantFailed]: 'Participant remove failed',
  [StringTemplates.ChatRemoveParticipantSuccess]: 'Participant removed',
  [StringTemplates.ChatCancelParticipantInviteFailed]: 'Participant invite cancel failed',
  [StringTemplates.ChatCancelParticipantInviteSuccess]: 'Participant invite canceled',
  [StringTemplates.ChatParticipantInviteOutstanding]:
    'Inviting participant failed. There is already an outstanding invite for the chat.',
});
