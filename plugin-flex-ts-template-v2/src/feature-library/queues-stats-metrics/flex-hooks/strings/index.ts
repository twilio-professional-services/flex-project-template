import esMX from './es-mx.json';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  AssignedTasksMetric = 'PSAssignedTasksMetric',
  WrappingTasksMetric = 'PSWrappingTasksMetric',
  AgentActivityHeader = 'PSAgentActivityHeader',
  AgentActivityDescription = 'PSAgentActivityDescription',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.AssignedTasksMetric]: 'The number of assigned tasks.',
    [StringTemplates.WrappingTasksMetric]: 'The number of wrapping tasks.',
    [StringTemplates.AgentActivityHeader]: 'Activity',
    [StringTemplates.AgentActivityDescription]: 'The number of agents by activity.',
  },
  'es-MX': esMX,
});
