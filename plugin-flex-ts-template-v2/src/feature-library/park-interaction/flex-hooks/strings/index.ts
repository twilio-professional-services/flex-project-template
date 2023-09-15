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
  ParkedInteractions = 'PSParkedInteractions',
  UnparkSuccess = 'PSUnparkSuccess',
  UnparkGenericError = 'PSUnparkGenericError',
  UnparkError = 'PSUnparkError',
  ColumnChannel = 'PSChannel',
  ColumnAddress = 'PSAddress',
  ColumnCustomerName = 'PSCustomerName',
  ColumnDateTimeParked = 'PSDateTimeParked',
  ColumnAction = 'PSAction',
  ResumeInteraction = 'PSResumeInteraction',
  NoItemsToList = 'PSNoItemsToList',
  UnparkListError = 'PSUnparkListError',
  UnparkDeleteItemError = 'PSUnparkDeleteItemError',
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
    [StringTemplates.ParkedInteractions]: 'Parked Interactions',
    [StringTemplates.UnparkSuccess]: 'The conversation is now unparked.',
    [StringTemplates.UnparkGenericError]: 'An error occurred while attempting to unpark the conversation: {{message}}',
    [StringTemplates.UnparkError]: 'Error while unparking, conversation is already closed or failed.',
    [StringTemplates.ColumnChannel]: 'Channel',
    [StringTemplates.ColumnAddress]: 'Address',
    [StringTemplates.ColumnCustomerName]: 'Customer Name',
    [StringTemplates.ColumnDateTimeParked]: 'Date/Time Parked',
    [StringTemplates.ColumnAction]: 'Action',
    [StringTemplates.ResumeInteraction]: 'Resume Interaction',
    [StringTemplates.NoItemsToList]: 'No items to list',
    [StringTemplates.UnparkListError]: 'Error loading recent interaction list: {{message}}',
    [StringTemplates.UnparkDeleteItemError]: 'Error deleting Sync Map item: {{message}}',
  },
  'es-ES': esES,
  'es-MX': esMX,
  'pt-BR': ptBR,
  th,
  'zh-Hans': zhHans,
});
