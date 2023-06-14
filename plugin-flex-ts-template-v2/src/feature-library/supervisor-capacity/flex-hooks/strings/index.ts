// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ChannelCapacity = 'PSSupervisorCapacityChannelCapacity',
  MissingConfiguration = 'PSSupervisorCapacityMissingConfiguration',
  NoChannels = 'PSSupervisorCapacityNoChannels',
  Loading = 'PSSupervisorCapacityLoading',
  RestorePreviousValue = 'PSSupervisorCapacityRestorePreviousValue',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.ChannelCapacity]: 'Channel Capacity',
    [StringTemplates.MissingConfiguration]: 'Missing configuration. Please notify your system administrator.',
    [StringTemplates.NoChannels]: 'No worker channels available.',
    [StringTemplates.Loading]: 'Loading...',
    [StringTemplates.RestorePreviousValue]: 'Restore previous value',
  },
});
