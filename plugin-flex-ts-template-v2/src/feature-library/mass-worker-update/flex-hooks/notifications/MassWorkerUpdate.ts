import * as Flex from '@twilio/flex-ui';
import { NotificationType } from '@twilio/flex-ui';

import { StringTemplates } from '../strings/MassWorkerUpdate';

export enum NotificationIds {
  SUCCESS = 'MassWorkerUpdateSuccess',
  CANCELLED = 'MassWorkerUpdateCancelled',
  IDENTIFY_FAILED = 'MassWorkerUpdateIdentifyFailed',
  EXECUTE_FAILED = 'MassWorkerUpdateExecuteFailed',
  RESET_FAILED = 'MassWorkerUpdateResetFailed',
}

export const notificationHook = (_flex: typeof Flex, _manager: Flex.Manager) => [
  {
    id: NotificationIds.SUCCESS,
    closeButton: true,
    content: StringTemplates.SUCCESS_UPDATED,
    type: NotificationType.success,
    timeout: 5000,
  },
  {
    id: NotificationIds.CANCELLED,
    closeButton: true,
    content: StringTemplates.CANCELLED,
    type: NotificationType.warning,
    timeout: 0,
  },
  {
    id: NotificationIds.IDENTIFY_FAILED,
    closeButton: true,
    content: StringTemplates.ERROR_IDENTIFY,
    type: NotificationType.error,
    timeout: 0,
  },
  {
    id: NotificationIds.EXECUTE_FAILED,
    closeButton: true,
    content: StringTemplates.ERROR_EXECUTE,
    type: NotificationType.error,
    timeout: 0,
  },
  {
    id: NotificationIds.RESET_FAILED,
    closeButton: true,
    content: StringTemplates.ERROR_RESET,
    type: NotificationType.error,
    timeout: 0,
  },
];
