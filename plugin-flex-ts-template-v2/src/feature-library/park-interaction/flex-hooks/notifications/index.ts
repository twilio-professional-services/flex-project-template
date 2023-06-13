import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum ParkInteractionNotification {
  ParkSuccess = 'PSParkSuccess',
  ParkError = 'PSParkError',
}

// Return an array of Flex.Notification
export const notificationHook = (flex: typeof Flex) => [
  {
    id: ParkInteractionNotification.ParkSuccess,
    type: flex.NotificationType.success,
    content: StringTemplates.ParkSuccess,
    closeButton: true,
    timeout: 3000,
  },
  {
    id: ParkInteractionNotification.ParkError,
    type: flex.NotificationType.error,
    content: StringTemplates.ParkError,
    closeButton: true,
    timeout: 5000,
  },
];
