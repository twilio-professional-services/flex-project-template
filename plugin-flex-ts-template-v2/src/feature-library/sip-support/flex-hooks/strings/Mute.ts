// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  MuteParticipant = 'PSMuteParticipant',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.MuteParticipant]: 'Mute Participant',
  },
});
