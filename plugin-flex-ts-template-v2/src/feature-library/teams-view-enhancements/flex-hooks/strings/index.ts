
// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  TeamsViewColumnTeamName = 'PSTeamsViewColumnTeamName',
  TeamsViewColumnSkills = 'PSTeamsViewColumnSkills',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.TeamsViewColumnTeamName]: 'Team Name',
    [StringTemplates.TeamsViewColumnSkills]: 'Skills',
  },
  'es-MX':{
    [StringTemplates.TeamsViewColumnTeamName]: 'Equipo',
    [StringTemplates.TeamsViewColumnSkills]: 'Habilidades',
  }

});
