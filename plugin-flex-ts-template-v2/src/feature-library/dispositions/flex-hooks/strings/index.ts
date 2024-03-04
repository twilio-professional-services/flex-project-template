import esES from './es-es.json';
import esMX from './es-mx.json';
import ptBR from './pt-br.json';
import th from './th.json';
import zhHans from './zh-hans.json';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  DispositionRequired = 'PSDispositionRequired',
  DispositionTab = 'PSDispositionTab',
  SelectDispositionTitle = 'PSSelectDispositionTitle',
  SelectDispositionHelpText = 'PSSelectDispositionHelpText',
  NotesTitle = 'PSNotesTitle',
  NotesCharactersRemaining = 'PSNotesCharactersRemaining',
  ChooseAnOption = 'PSChooseAnOption',
  ChooseOptions = 'PSChooseOption',
  AttributeRequired = 'PSAttributeRequired',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.DispositionRequired]: 'A disposition is required before you may complete this task.',
    [StringTemplates.DispositionTab]: 'Disposition',
    [StringTemplates.SelectDispositionTitle]: 'Select a disposition',
    [StringTemplates.SelectDispositionHelpText]: 'The selected disposition will be saved when you complete this task.',
    [StringTemplates.NotesTitle]: 'Notes',
    [StringTemplates.NotesCharactersRemaining]: '{{characters}} characters remaining',
    [StringTemplates.ChooseAnOption]: 'Choose an option',
    [StringTemplates.ChooseOptions]: 'Choose one or more options',
    [StringTemplates.AttributeRequired]: 'Please select an option or enter a value for all required fields.',
  },
  'es-MX': esMX,
  'pt-BR': ptBR,
  th,
  'zh-Hans': zhHans,
  'es-ES': esES,
});
