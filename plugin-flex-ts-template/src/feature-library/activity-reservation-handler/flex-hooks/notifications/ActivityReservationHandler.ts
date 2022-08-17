import * as Flex from '@twilio/flex-ui';
import { NotificationType } from '@twilio/flex-ui';
import { StringTemplates } from '../strings/ActivityReservationHandler';

export enum NotificationIds {
  ActivityChangeDelayed = 'PSActivityChangeDelayed',
  RestrictedActivities = 'PSRestrictedActivities',
}

export default (flex: typeof Flex, manager: Flex.Manager) => {
  activityChangeDelayed(flex, manager);
  restrictedActivities(flex, manager);
};

function activityChangeDelayed(flex: typeof Flex, manager: Flex.Manager) {
  flex.Notifications.registerNotification({
    id: NotificationIds.ActivityChangeDelayed,
    closeButton: true,
    content: StringTemplates.ActivityChangeDelayed,
    timeout: 5000,
    type: NotificationType.success,
  });
}

function restrictedActivities(flex: typeof Flex, manager: Flex.Manager) {
  flex.Notifications.registerNotification({
    id: NotificationIds.RestrictedActivities,
    closeButton: true,
    content: StringTemplates.RestrictedActivities,
    type: NotificationType.warning,
    timeout: 5000,
  });
}
