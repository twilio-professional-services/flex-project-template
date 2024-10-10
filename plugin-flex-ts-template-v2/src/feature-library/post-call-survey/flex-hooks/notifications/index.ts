import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum PostCallSurveyUiNotification {
  SAVE_ERROR = 'PSPCRSaveError',
  SAVE_SUCCESS = 'PSPCRSaveSuccess',
  SAVE_DISABLED = 'PSPCRSaveDisabled',
  SYNC_ERROR = 'PSPCSSyncError',
}

// Return an array of Flex.Notification
export const notificationHook = (flex: typeof Flex, _manager: Flex.Manager) => [
  {
    id: PostCallSurveyUiNotification.SAVE_ERROR,
    type: flex.NotificationType.error,
    content: StringTemplates.SAVE_ERROR,
    timeout: 3000,
    closeButton: true,
  },
  {
    id: PostCallSurveyUiNotification.SAVE_SUCCESS,
    type: flex.NotificationType.success,
    content: StringTemplates.SAVE_SUCCESS,
    timeout: 3000,
    closeButton: true,
  },
  {
    id: PostCallSurveyUiNotification.SAVE_DISABLED,
    type: flex.NotificationType.warning,
    content: StringTemplates.SAVE_DISABLED,
    timeout: 0,
    closeButton: false,
  },
  {
    id: PostCallSurveyUiNotification.SYNC_ERROR,
    type: flex.NotificationType.error,
    content: StringTemplates.SYNC_ERROR,
    closeButton: true,
    timeout: 5000,
  },
];
