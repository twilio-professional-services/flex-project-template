// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ChatTransferTaskSuccess = "ChatTransferTaskSuccess",
  ChatTransferFailedGeneric = "ChatTransferFailedGeneric",
  ChatTransferFailedConsultNotSupported = "ChatTransferFailedConsultNotSupported",
}

export default {
  [StringTemplates.ChatTransferTaskSuccess]: "Conversation transferred",
  [StringTemplates.ChatTransferFailedGeneric]:
    "Error occured with conversation transfer",
  [StringTemplates.ChatTransferFailedConsultNotSupported]:
    "Consult/Warm transfer is not supported",
};
