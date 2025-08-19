// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  AssociationRequired = 'PSSalesforceAssociationRequired',
  AlreadyOnPhone = 'PSSalesforceAlreadyOnPhone',
  IncomingTaskLabel = 'PSSalesforceIncomingTaskLabel',
  TasksLabel = 'PSSalesforceTasksLabel',
  UnableToCallOffline = 'PSSalesforceUnableToCallOffline',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.AssociationRequired]: 'Please select a Salesforce record to associate before completing the task.',
    [StringTemplates.AlreadyOnPhone]: 'You must end your current call before placing a new call.',
    [StringTemplates.IncomingTaskLabel]: 'Incoming Task',
    [StringTemplates.TasksLabel]: '{{numTasks}} {{#if singular}}Task{{else}}Tasks{{/if}}',
    [StringTemplates.UnableToCallOffline]:
      'You must change to an activity other than "{{activity}}" before placing a new call.',
  },
});
