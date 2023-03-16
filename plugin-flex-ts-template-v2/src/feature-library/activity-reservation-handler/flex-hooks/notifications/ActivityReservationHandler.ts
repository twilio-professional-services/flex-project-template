import * as Flex from '@twilio/flex-ui';
import { StringTemplates } from '../strings/ActivityReservationHandler';

export enum NotificationIds {
  ActivityChangeDelayed = 'PSActivityChangeDelayed',
  RestrictedActivities = 'PSRestrictedActivities',
}

export const notificationHook = (flex: typeof Flex, manager: Flex.Manager) => [
  {
    id: NotificationIds.ActivityChangeDelayed,
    closeButton: true,
    content: StringTemplates.ActivityChangeDelayed,
    timeout: 5000,
    type: Flex.NotificationType.success,
  },
  {
    id: NotificationIds.RestrictedActivities,
    closeButton: true,
    content: StringTemplates.RestrictedActivities,
    type: Flex.NotificationType.warning,
    timeout: 5000,
  }
]
