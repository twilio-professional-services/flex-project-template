// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  Loading = 'PSCallerIdLoading',
  LoadingFailed = 'PSCallerIdLoadingFailed',
  ChooseCallerId = 'PSCallerIdChoose',
  CallerId = 'PSCallerId',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.Loading]: 'Loading phone numbers...',
    [StringTemplates.LoadingFailed]: 'Unable to load phone numbers',
    [StringTemplates.ChooseCallerId]: 'Choose a Caller ID',
    [StringTemplates.CallerId]: 'Caller ID',
  },
});
