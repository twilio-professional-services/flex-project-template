// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  TeamsViewColumnTeamName = 'PSTeamsViewColumnTeamName',
  TeamsViewColumnDepartment = 'PSTeamsViewColumnDepartment',
  TeamsViewColumnLocation = 'PSTeamsViewColumnLocation',
  TeamsViewColumnSkills = 'PSTeamsViewColumnSkills',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.TeamsViewColumnTeamName]: 'Team Name',
    [StringTemplates.TeamsViewColumnDepartment]: 'Department',
    [StringTemplates.TeamsViewColumnLocation]: 'Location',
    [StringTemplates.TeamsViewColumnSkills]: 'Skills',
  },
  'es-MX': {
    [StringTemplates.TeamsViewColumnTeamName]: 'Equipo',
    [StringTemplates.TeamsViewColumnDepartment]: 'Departamento',
    [StringTemplates.TeamsViewColumnLocation]: 'Lugar',
    [StringTemplates.TeamsViewColumnSkills]: 'Habilidades',
  },
});
