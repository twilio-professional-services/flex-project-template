import esMX from './es-mx.json';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  PSUpdateWorkerName = 'PSUpdateWorkerName',
  PSUpdateWorkerTeam = 'PSUpdateWorkerTeam',
  PSUpdateWorkerDepartment = 'PSUpdateWorkerDepartment',
  PSUpdateWorkerLocation = 'PSUpdateWorkerLocation',
  PSUpdateWorkerManager = 'PSUpdateWorkerManager',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.PSUpdateWorkerName]: 'Name',
    [StringTemplates.PSUpdateWorkerTeam]: 'Team',
    [StringTemplates.PSUpdateWorkerDepartment]: 'Department',
    [StringTemplates.PSUpdateWorkerLocation]: 'Location',
    [StringTemplates.PSUpdateWorkerManager]: 'Manager',
  },
  'es-MX': esMX,
});
