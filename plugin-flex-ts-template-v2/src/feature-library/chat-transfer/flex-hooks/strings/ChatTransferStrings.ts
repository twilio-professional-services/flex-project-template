// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ChatTransferTaskSuccess = "ChatTransferTaskSuccess",
  ChatTransferFailedGeneric = "ChatTransferFailedGeneric",
  ChatTransferFailedConsultNotSupported = "ChatTransferFailedConsultNotSupported",
  ChatParticipantInvited = "ChatParticipantInvited",
  ChatRemoveParticipantFailed = "ChatRemoveParticipantFailed",
}

export default {
  [StringTemplates.ChatTransferTaskSuccess]: "Conversation transferred",
  [StringTemplates.ChatParticipantInvited]: "Participant invited",
  [StringTemplates.ChatTransferFailedGeneric]:
    "Error occured adding new participant",
  [StringTemplates.ChatTransferFailedConsultNotSupported]:
    "Consult/Warm transfer is not supported",
  [StringTemplates.ChatRemoveParticipantFailed]:
    "Remove chat participant failed",
};
