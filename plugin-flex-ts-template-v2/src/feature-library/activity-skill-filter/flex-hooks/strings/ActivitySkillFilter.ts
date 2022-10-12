// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ActivitySkillRulesNotConfigured = 'PSActivitySkillRulesNotConfigured'
}

export default {
  [StringTemplates.ActivitySkillRulesNotConfigured]: 'Activity skill filter rules are not configured. The activity menu has not been modified.'
}
