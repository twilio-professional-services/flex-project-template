import ptBR from './pt-br.json';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ExtendWrapup = 'PSAgentAutomationExtendWrapup',
  WrapupSecondsRemaining = 'PSAgentAutomationWrapupSecondsRemaining',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.ExtendWrapup]: 'Extend Wrap Up',
    [StringTemplates.WrapupSecondsRemaining]:
      'Wrap up | {{seconds}} {{#if singular}}second{{else}}seconds{{/if}} remaining',
  },
  'pt-BR': ptBR,
});
