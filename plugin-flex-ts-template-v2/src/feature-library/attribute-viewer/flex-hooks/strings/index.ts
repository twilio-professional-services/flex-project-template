import esMX from './es-mx.json';
import ptBR from './pt-br.json';
import th from './th.json';
import zhHans from './zh-hans.json';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  TaskAttributesHeader = 'PSTaskAttributesHeader',
  WorkerAttributesHeader = 'PSWorkerAttributesHeader',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.TaskAttributesHeader]: 'Task attributes',
    [StringTemplates.WorkerAttributesHeader]: 'Attributes',
  },
  'es-MX': esMX,
  'pt-BR': ptBR,
  th,
  'zh-Hans': zhHans,
});
