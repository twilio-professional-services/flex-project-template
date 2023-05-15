import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings/Conference';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum ConferenceNotification {
  FailedHangupNotification = 'PS_FailedHangupOnConferenceWithExternalParties',
  ExternalWarmTransferInvalidPhoneNumber = 'PS_ExternalWarmTransferInvalidPhoneNumber',
}

export const notificationHook = (_flex: typeof Flex, _manager: Flex.Manager) => [
  {
    id: ConferenceNotification.FailedHangupNotification,
    type: Flex.NotificationType.error,
    content: StringTemplates.ExternalTransferFailedHangupNotification,
  },
  {
    id: ConferenceNotification.ExternalWarmTransferInvalidPhoneNumber,
    timeout: 8000,
    type: Flex.NotificationType.error,
    content: StringTemplates.ExternalWarmTransferInvalidPhoneNumber,
  },
];
