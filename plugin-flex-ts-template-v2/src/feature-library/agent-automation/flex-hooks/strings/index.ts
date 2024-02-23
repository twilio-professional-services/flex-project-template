// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  PSExtendWrapup = 'ExtendWrapup',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.PSExtendWrapup]: 'Extend Wrap Up',
  },
});
