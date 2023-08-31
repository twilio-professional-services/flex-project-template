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
  ParkInteractionTitle = 'PSParkTitle',
  RecentInteractionList = 'PSRecentInteractionList',
  UnparkSuccess = 'PSUnparkSuccess',
  UnparkError = 'PSUnparkError',
  ColumnChannel = 'PSChannel',
  ColumnPhoneEmail = 'PSPhoneEmail',
  ColumnCustomerName = 'PSCustomerName',
  ColumnDateAndTime = 'PSDateAndTime',
  ColumnQueue = 'PSQueue',
  ColumnAction = 'PSAction',
  ResumeInteraction = 'PSResumeInteraction',
  NoItemsToList = 'PSNoItemsToList',
  UnparkListError = 'PSUnparkListError',
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
    [StringTemplates.RecentInteractionList]: 'Recent Interaction List',
    [StringTemplates.UnparkSuccess]: 'The conversation is now unparked.',
    [StringTemplates.UnparkError]: 'An error occurred while attempting to unpark the conversation: {{message}}',
    [StringTemplates.ColumnChannel]: 'Channel',
    [StringTemplates.ColumnPhoneEmail]: 'Phone/Email',
    [StringTemplates.ColumnCustomerName]: 'Customer Name',
    [StringTemplates.ColumnDateAndTime]: 'Date & Time',
    [StringTemplates.ColumnQueue]: 'Queue',
    [StringTemplates.ColumnAction]: 'Action',
    [StringTemplates.ResumeInteraction]: 'Resume Interaction',
    [StringTemplates.NoItemsToList]: 'No items to list',
    [StringTemplates.UnparkListError]: 'Error loading recent interaction list: {{message}}',
  },
  'es-ES': esES,
  'es-MX': esMX,
  'pt-BR': ptBR,
  th,
  'zh-Hans': zhHans,
});
