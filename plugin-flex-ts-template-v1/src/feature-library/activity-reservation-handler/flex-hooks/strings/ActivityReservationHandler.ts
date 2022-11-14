// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ActivityChangeDelayed = 'PSActivityChangeDelayed',
  RestrictedActivities = 'PSRestrictedActivities',
}

export default {
  [StringTemplates.ActivityChangeDelayed]: 'You will be set to "{{activityName}}" when all tasks are completed',
  [StringTemplates.RestrictedActivities]: 'Status "{{activityName}}" cannot be manually selected',
};
