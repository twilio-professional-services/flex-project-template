// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  CallAgent = 'PSInternalCallCallAgent',
  SelectAgent = 'PSInternalCallSelectAgent',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.CallAgent]: 'Call Agent',
    [StringTemplates.SelectAgent]: 'Select an agent',
  },
});
