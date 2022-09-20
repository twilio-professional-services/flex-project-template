import * as Flex from '@twilio/flex-ui';
import { StringTemplates } from '../strings/Conference';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum ConferenceNotification {
  FailedHangupNotification = 'PS_FailedHangupOnConferenceWithExternalParties'
};

export default (flex: typeof Flex, manager: Flex.Manager) => {
  failedHangupNotification(flex, manager);
}

function failedHangupNotification(flex: typeof Flex, manager: Flex.Manager) {
  flex.Notifications.registerNotification({
    id: ConferenceNotification.FailedHangupNotification,
    type: Flex.NotificationType.error,
    content: StringTemplates.ExternalTransferFailedHangupNotification
  });
}