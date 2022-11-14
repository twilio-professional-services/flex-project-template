// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ActivitySkillRulesNotConfigured = 'PSActivitySkillRulesNotConfigured'
}

export default {
  [StringTemplates.ActivitySkillRulesNotConfigured]: 'Agent activity rules are not configured.  CustomUserControls have not been loaded.'
}
