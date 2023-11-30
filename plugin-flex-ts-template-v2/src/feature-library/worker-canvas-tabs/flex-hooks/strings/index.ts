import esMX from './es-mx.json';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  WorkerCanvasTabSkills = 'PSWorkerCanvasTabSkills',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.WorkerCanvasTabSkills]: 'Skills',
  },
  'es-MX': esMX,
});
