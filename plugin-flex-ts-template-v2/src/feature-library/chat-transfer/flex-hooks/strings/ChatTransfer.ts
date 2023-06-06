// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  FailedToSubmitTransfer = 'PSFailedToSubmitTransferNotification',
  FailedToUpdateTaskAttributes = 'PSFailedToUpdateTaskAttributesForChatTransferNotification',
  JoinMessage = 'PSChatTransferJoinMessage',
  LeaveMessage = 'PSChatTransferLeaveMessage',
  TransferChat = 'PSChatTransferTransferChat',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.FailedToSubmitTransfer]:
      'Failed to submit transfer. {{message}}; please try again.  If the problem persists, please contact a supervisor.',
    [StringTemplates.FailedToUpdateTaskAttributes]:
      'Failed to update task for transfer. You may continue, but please notify a supervisor.',
    [StringTemplates.JoinMessage]: '{{workerName}} joined the channel',
    [StringTemplates.LeaveMessage]: '{{workerName}} left the channel',
    [StringTemplates.TransferChat]: 'Transfer Chat',
  },
});
