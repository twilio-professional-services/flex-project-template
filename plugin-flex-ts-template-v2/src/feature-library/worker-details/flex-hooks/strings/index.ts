import esMX from './es-mx.json';

export const stringPrefix = 'PSWorkerDetails';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  PSWorkerDetailsTeam = 'PSWorkerDetailsTeam',
  PSWorkerDetailsDepartment = 'PSWorkerDetailsDepartment',
  PSWorkerDetailsLocation = 'PSWorkerDetailsLocation',
  PSWorkerDetailsManager = 'PSWorkerDetailsManager',
  PSWorkerDetailsSettings = 'PSWorkerDetailsSettings',
  PSWorkerDetailsContainerName = 'PSWorkerDetailsContainerName',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.PSWorkerDetailsTeam]: 'Team',
    [StringTemplates.PSWorkerDetailsDepartment]: 'Department',
    [StringTemplates.PSWorkerDetailsLocation]: 'Location',
    [StringTemplates.PSWorkerDetailsManager]: 'Manager',
    [StringTemplates.PSWorkerDetailsSettings]: 'Configuration Settings',
    [StringTemplates.PSWorkerDetailsContainerName]: 'Details',
  },
  'es-MX': esMX,
});
