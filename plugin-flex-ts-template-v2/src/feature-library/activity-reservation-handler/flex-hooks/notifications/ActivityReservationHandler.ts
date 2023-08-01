import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings/ActivityReservationHandler';

export enum NotificationIds {
  ActivityChangeDelayed = 'PSActivityChangeDelayed',
  SupervisorActivityChangeDelayed = 'PSSupervisorActivityChangeDelayed',
  RestrictedActivities = 'PSRestrictedActivities',
}

export const notificationHook = (_flex: typeof Flex, _manager: Flex.Manager) => [
  {
    id: NotificationIds.ActivityChangeDelayed,
    closeButton: true,
    content: StringTemplates.ActivityChangeDelayed,
    timeout: 5000,
    type: Flex.NotificationType.success,
  },
  {
    id: NotificationIds.SupervisorActivityChangeDelayed,
    closeButton: true,
    content: StringTemplates.SupervisorActivityChangeDelayed,
    timeout: 5000,
    type: Flex.NotificationType.success,
  },
  {
    id: NotificationIds.RestrictedActivities,
    closeButton: true,
    content: StringTemplates.RestrictedActivities,
    type: Flex.NotificationType.warning,
    timeout: 5000,
  },
];
