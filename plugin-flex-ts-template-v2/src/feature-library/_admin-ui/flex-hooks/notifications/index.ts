import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum AdminUiNotification {
  SAVE_ERROR = 'PSAdminSaveError',
  SAVE_SUCCESS = 'PSAdminSaveSuccess',
  SAVE_DISABLED = 'PSAdminSaveDisabled',
}

// Return an array of Flex.Notification
export const notificationHook = (flex: typeof Flex, _manager: Flex.Manager) => [
  {
    id: AdminUiNotification.SAVE_ERROR,
    type: flex.NotificationType.error,
    content: StringTemplates.SAVE_ERROR,
    timeout: 3000,
    closeButton: true,
  },
  {
    id: AdminUiNotification.SAVE_SUCCESS,
    type: flex.NotificationType.success,
    content: StringTemplates.SAVE_SUCCESS,
    timeout: 3000,
    closeButton: true,
  },
  {
    id: AdminUiNotification.SAVE_DISABLED,
    type: flex.NotificationType.warning,
    content: StringTemplates.SAVE_DISABLED,
    timeout: 0,
    closeButton: false,
  },
];
