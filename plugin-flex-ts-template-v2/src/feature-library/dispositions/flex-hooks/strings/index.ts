// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  DispositionRequired = 'PSDispositionRequired',
}

export const stringHook = () => ({
  [StringTemplates.DispositionRequired]: 'A disposition is required before you may complete this task.',
});
