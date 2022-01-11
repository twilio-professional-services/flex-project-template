// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
    TaskListItemSecondLineActive = 'PSVendorsTaskListItemSecondLineActive',
    TaskListItemSecondLineWrap = 'PSVendorsTaskListItemSecondLineWrap',
}

export default {
    // Replacement for the TaskListItem second line.
    // @see "TaskLineCallAssigned" and "TaskLineCallWrapup"
    // @link https://www.twilio.com/docs/flex/developer/ui/localization-and-templating#accessing-task-context-properties-and-attributes
    [StringTemplates.TaskListItemSecondLineWrap]: 'Wrap up | {{helper.durationSinceUpdate}}',
    [StringTemplates.TaskListItemSecondLineActive]: '{{task.queueName}} | Active | {{helper.durationSinceUpdate}}',
}
