import esMX from './es-mx.json';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  WorkerCanvasTabSkills = 'PSWorkerCanvasTabSkills',
  WorkerCanvasTabCapacity = 'PSWorkerCanvasTabCapacity',
  WorkerCanvasTabAttributes = 'PSWorkerCanvasTabAttributes',
  WorkerCanvasTabTeamName = 'PSWorkerCanvasTabTeamName',
  WorkerCanvasTabDetails = 'PSWorkerCanvasTabDetails',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.WorkerCanvasTabSkills]: 'Skills',
    [StringTemplates.WorkerCanvasTabCapacity]: 'Capacity',
    [StringTemplates.WorkerCanvasTabAttributes]: 'Attributes',
    [StringTemplates.WorkerCanvasTabTeamName]: 'Team',
    [StringTemplates.WorkerCanvasTabDetails]: 'Details',
  },
  'es-MX': esMX,
});
