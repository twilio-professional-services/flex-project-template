// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  FailedToSubmitTransfer = 'PSFailedToSubmitTransferNotification',
  FailedToUpdateTaskAttributes = 'PSFailedToUpdateTaskAttributesForChatTransferNotification',
}

export const stringHook = () => ({
  [StringTemplates.FailedToSubmitTransfer]:
    'Failed to submit transfer. {{message}}; please try again.  If the problem persists, please contact a supervisor.',
  [StringTemplates.FailedToUpdateTaskAttributes]:
    'Failed to update task for transfer. You may continue, but please notify a supervisor.',
});
