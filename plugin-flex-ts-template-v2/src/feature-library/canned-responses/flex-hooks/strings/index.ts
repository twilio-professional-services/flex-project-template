// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  CannedResponses = 'PSCannedResponses',
  ErrorFetching = 'PSCannedResponsesErrorFetching',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.CannedResponses]: 'Canned Chat Responses',
    [StringTemplates.ErrorFetching]: 'There was an error fetching responses. Please reload the page.',
  },
});
