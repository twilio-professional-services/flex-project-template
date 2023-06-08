// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  DualChannelBroken = 'PSDualChannelBroken',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.DualChannelBroken]:
      'The dual channel recording feature will not work because it has not been configured correctly.',
  },
});
