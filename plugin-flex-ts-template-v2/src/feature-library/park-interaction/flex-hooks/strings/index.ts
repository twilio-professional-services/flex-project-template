// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ParkSuccess = 'PSParkSuccess',
  ParkError = 'PSParkError',
  ParkInteraction = 'PSParkInteraction',
  WebhookError = 'PSParkWebhookError',
  NonCbmError = 'PSParkNonCbmError',
  MultipleParticipantsError = 'PSParkMultipleParticipantsError',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.ParkSuccess]: 'The conversation is now parked.',
    [StringTemplates.ParkError]: 'An error occurred while attempting to park the conversation: {{message}}',
    [StringTemplates.ParkInteraction]: 'Park interaction',
    [StringTemplates.WebhookError]: 'Invalid webhook URL. Parking is not supported when running locally.',
    [StringTemplates.NonCbmError]: 'Parking is only available for conversation-based messaging tasks.',
    [StringTemplates.MultipleParticipantsError]:
      'This conversation cannot be parked because there are multiple internal participants.',
  },
});
