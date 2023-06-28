import esES from './es-es.json';
import esMX from './es-mx.json';
import ptBR from './pt-br.json';
import th from './th.json';
import zhHans from './zh-hans.json';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ParkSuccess = 'PSParkSuccess',
  ParkError = 'PSParkError',
  ParkInteraction = 'PSParkInteraction',
  WebhookError = 'PSParkWebhookError',
  NonCbmError = 'PSParkNonCbmError',
  MultipleParticipantsError = 'PSParkMultipleParticipantsError',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.ParkSuccess]: 'The conversation is now parked.',
    [StringTemplates.ParkError]: 'An error occurred while attempting to park the conversation: {{message}}',
    [StringTemplates.ParkInteraction]: 'Park interaction',
    [StringTemplates.WebhookError]: 'Invalid webhook URL. Parking is not supported when running locally.',
    [StringTemplates.NonCbmError]: 'Parking is only available for conversation-based messaging tasks.',
    [StringTemplates.MultipleParticipantsError]:
      'This conversation cannot be parked because there are multiple internal participants.',
  },
  'es-ES': esES,
  'es-MX': esMX,
  'pt-BR': ptBR,
  th,
  'zh-Hans': zhHans,
});
