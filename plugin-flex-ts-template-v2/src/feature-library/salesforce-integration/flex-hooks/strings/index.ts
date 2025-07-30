// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  AssociationRequired = 'PSSalesforceAssociationRequired',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.AssociationRequired]: 'Please select a Salesforce record to associate before completing the task.',
  },
});
