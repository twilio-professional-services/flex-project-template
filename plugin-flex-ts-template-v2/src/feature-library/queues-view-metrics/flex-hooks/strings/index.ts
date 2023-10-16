import esMX from './es-mx.json';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  AssignedTasksMetric = 'PSAssignedTasksMetric',
  WrappingTasksMetric = 'PSWrappingTasksMetric',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.AssignedTasksMetric]: 'The number of assigned tasks.',
    [StringTemplates.WrappingTasksMetric]: 'The number of wrapping tasks.',
  },
  'es-MX': esMX,
});
