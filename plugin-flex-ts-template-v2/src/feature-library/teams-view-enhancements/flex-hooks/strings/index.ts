// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  TeamsViewColumnActivity = 'PSTeamsViewColumnActivity',
  TeamsViewColumnTeamName = 'PSTeamsViewColumnTeamName',
  TeamsViewColumnDepartment = 'PSTeamsViewColumnDepartment',
  TeamsViewColumnLocation = 'PSTeamsViewColumnLocation',
  TeamsViewColumnSkills = 'PSTeamsViewColumnSkills',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.TeamsViewColumnActivity]: 'Activity',
    [StringTemplates.TeamsViewColumnTeamName]: 'Team Name',
    [StringTemplates.TeamsViewColumnDepartment]: 'Department',
    [StringTemplates.TeamsViewColumnLocation]: 'Location',
    [StringTemplates.TeamsViewColumnSkills]: 'Skills',
  },
  'es-MX': {
    [StringTemplates.TeamsViewColumnActivity]: 'Actividad',
    [StringTemplates.TeamsViewColumnTeamName]: 'Equipo',
    [StringTemplates.TeamsViewColumnDepartment]: 'Departamento',
    [StringTemplates.TeamsViewColumnLocation]: 'Lugar',
    [StringTemplates.TeamsViewColumnSkills]: 'Habilidades',
  },
});
