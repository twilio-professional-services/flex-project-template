import * as Flex from '@twilio/flex-ui';
import { NotificationType } from '@twilio/flex-ui';

import { StringTemplates } from '../strings/ScheduleManager';

export enum NotificationIds {
  PUBLISH_ABORTED = 'SchMgrPublishAborted',
  PUBLISH_FAILED_MIDAIR = 'SchMgrPublishFailedMidair',
  PUBLISH_FAILED_OTHER_UPDATE = 'SchMgrPublishFailedOtherUpdate',
  PUBLISH_FAILED = 'SchMgrPublishFailed',
  PUBLISH_FAILED_ACTIVITY = 'SchMgrPublishFailedActivity',
  PUBLISH_SUCCESS = 'SchMgrPublishSuccess',
}

export const notificationHook = (_flex: typeof Flex, _manager: Flex.Manager) => [
  {
    id: NotificationIds.PUBLISH_ABORTED,
    closeButton: true,
    content: StringTemplates.PUBLISH_ABORTED,
    type: NotificationType.error,
    timeout: 0,
  },
  {
    id: NotificationIds.PUBLISH_FAILED_OTHER_UPDATE,
    closeButton: true,
    content: StringTemplates.PUBLISH_FAILED_OTHER_UPDATE,
    type: NotificationType.error,
    timeout: 0,
  },
  {
    id: NotificationIds.PUBLISH_FAILED,
    closeButton: true,
    content: StringTemplates.PUBLISH_FAILED,
    type: NotificationType.error,
    timeout: 0,
  },
  {
    id: NotificationIds.PUBLISH_FAILED_ACTIVITY,
    closeButton: true,
    content: StringTemplates.PUBLISH_FAILED_ACTIVITY,
    type: NotificationType.error,
    timeout: 0,
  },
  {
    id: NotificationIds.PUBLISH_SUCCESS,
    closeButton: true,
    content: StringTemplates.PUBLISH_SUCCESS,
    type: NotificationType.success,
    timeout: 3000,
  },
];
