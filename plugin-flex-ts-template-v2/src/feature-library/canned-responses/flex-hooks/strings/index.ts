import esES from './es-es.json';
import esMX from './es-mx.json';
import ptBR from './pt-br.json';
import th from './th.json';
import zhHans from './zh-hans.json';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  CannedResponses = 'PSCannedResponses',
  ErrorFetching = 'PSCannedResponsesErrorFetching',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.CannedResponses]: 'Canned Chat Responses',
    [StringTemplates.ErrorFetching]: 'There was an error fetching responses. Please reload the page.',
  },
  'es-MX': esMX,
  'pt-BR': ptBR,
  th,
  'zh-Hans': zhHans,
  'es-ES': esES,
});
