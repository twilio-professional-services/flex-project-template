import esES from './es-es.json';
import esMX from './es-mx.json';
import ptBR from './pt-br.json';
import th from './th.json';
import zhHans from './zh-hans.json';

export enum StringTemplates {
  TITLE = 'PSPCSSettingsTitle',
  SAVE = 'PSPCSSave',
  SAVE_ERROR = 'PSPCSAdminSaveError',
  SAVE_SUCCESS = 'PSPCSAdminSaveSuccess',
  SAVE_DISABLED = 'PSPCSAdminSaveDisabled',
  SAVE_COPY_BUTTON = 'PSPCSSaveCopyButton',
  DELETE_BUTTON = 'PSPCSDeleteButton',
  CLOSED_REASON = 'PSPCSClosedReason',
  PROMPT_TYPE = 'PSPCSPromptType',
  PROMPT_TYPE_TEXT = 'PSPCSPromptTypeText',
  OPTIONS = 'PSPCSOptions',
  RESPONSES = 'PSPCSResponses',
  QUESTION_TEXT = 'PSPCSQuestion',
  QUESTION_TEXT_HELP = 'PSPCSQuestionHelp',
  SYNC_ERROR = 'PSPCSSyncError',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.TITLE]: 'Post Call Survey Settings',
    [StringTemplates.SAVE_ERROR]: 'There was an error saving the changes. Please try again.',
    [StringTemplates.SAVE_SUCCESS]: 'Changes saved successfully. Reload Flex for changes to take effect.',
    [StringTemplates.SAVE_DISABLED]: 'Saving settings is unavailable until the view is reloaded.',
    [StringTemplates.PROMPT_TYPE]: 'Prompt type',
    [StringTemplates.PROMPT_TYPE_TEXT]: 'Choose the options users can respond with to this question.',
    [StringTemplates.SAVE]: 'Save',
    [StringTemplates.SAVE_COPY_BUTTON]: 'Save a copy',
    [StringTemplates.OPTIONS]: 'Options',
    [StringTemplates.RESPONSES]: 'Responses',
    [StringTemplates.QUESTION_TEXT]: 'Question Text',
    [StringTemplates.QUESTION_TEXT_HELP]: 'Enter the text to be read to the user for this question',
    [StringTemplates.SYNC_ERROR]: 'Error loading survey data: {{message}}',
  },
  'es-MX': esMX,
  'pt-BR': ptBR,
  th,
  'zh-Hans': zhHans,
  'es-ES': esES,
});
