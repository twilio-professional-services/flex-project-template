import esMX from './es-mx.json';
import ptBR from './pt-br.json';
import th from './th.json';
import zhHans from './zh-hans.json';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ExternalTransferFailedHangupNotification = 'PSConferenceFailedHangupNotification',
  ExternalWarmTransferInvalidPhoneNumber = 'PSExternalWarmTransferInvalidPhoneNumber',
  AddConferenceParticipant = 'PSConferenceAddConferenceParticipant',
  PhoneNumber = 'PSConferencePhoneNumber',
  PhoneNumberError = 'PSConferencePhoneNumberError',
  Dial = 'PSConferenceDial',
  HoldParticipant = 'PSConferenceHoldParticipant',
  UnholdParticipant = 'PSConferenceUnholdParticipant',
  RemoveParticipant = 'PSConferenceRemoveParticipant',
  Unknown = 'PSConferenceUnknown',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.ExternalTransferFailedHangupNotification]:
      'Hangup call abandoned: Failed to take all participants off hold while hanging up the call. If this issue persists, please try unholding participants manually before leaving the call',
    [StringTemplates.ExternalWarmTransferInvalidPhoneNumber]: 'Unable to add participant. {{message}}',
    [StringTemplates.AddConferenceParticipant]: 'Add Conference Participant',
    [StringTemplates.PhoneNumber]: 'Phone Number',
    [StringTemplates.PhoneNumberError]: 'Enter a phone number to add to the conference.',
    [StringTemplates.Dial]: 'Dial',
    [StringTemplates.HoldParticipant]: 'Hold Participant',
    [StringTemplates.UnholdParticipant]: 'Unhold Participant',
    [StringTemplates.RemoveParticipant]: 'Remove Participant',
    [StringTemplates.Unknown]: 'Unknown',
  },
  'es-MX': esMX,
  'pt-BR': ptBR,
  th,
  'zh-Hans': zhHans,
});
