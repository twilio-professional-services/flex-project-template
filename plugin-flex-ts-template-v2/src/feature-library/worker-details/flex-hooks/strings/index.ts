import esMX from './es-mx.json';

export const stringPrefix = 'PSWorkerDetails';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  PSWorkerDetailsName = 'PSWorkerDetailsName',
  PSWorkerDetailsTeam = 'PSWorkerDetailsTeam',
  PSWorkerDetailsDepartment = 'PSWorkerDetailsDepartment',
  PSWorkerDetailsLocation = 'PSWorkerDetailsLocation',
  PSWorkerDetailsManager = 'PSWorkerDetailsManager',
  PSWorkerDetailsSchedule = 'PSWorkerDetailsSchedule',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.PSWorkerDetailsName]: 'Name',
    [StringTemplates.PSWorkerDetailsTeam]: 'Team',
    [StringTemplates.PSWorkerDetailsDepartment]: 'Department',
    [StringTemplates.PSWorkerDetailsLocation]: 'Location',
    [StringTemplates.PSWorkerDetailsManager]: 'Manager',
    [StringTemplates.PSWorkerDetailsSchedule]: 'Schedule',
  },
  'es-MX': esMX,
});
