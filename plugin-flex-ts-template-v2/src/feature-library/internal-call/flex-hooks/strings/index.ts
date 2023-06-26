import esES from './es-es.json';
import esMX from './es-mx.json';
import ptBR from './pt-br.json';
import th from './th.json';
import zhHans from './zh-hans.json';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  CallAgent = 'PSInternalCallCallAgent',
  SelectAgent = 'PSInternalCallSelectAgent',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.CallAgent]: 'Call Agent',
    [StringTemplates.SelectAgent]: 'Select an agent',
  },
  'es-MX': esMX,
  'pt-BR': ptBR,
  th,
  'zh-Hans': zhHans,
  'es-ES': esES,
});
