import * as Flex from '@twilio/flex-ui';
import { StringTemplates } from '../strings/ActivitySkillFilter';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum NotificationIds {
  ActivitySkillRulesNotConfigured = 'PSActivitySkillRulesNotConfigured'
};

export default (flex: typeof Flex, manager: Flex.Manager) => {
  activitySkillRulesNotConfigured(flex, manager);
}

function activitySkillRulesNotConfigured(flex: typeof Flex, manager: Flex.Manager) {
  flex.Notifications.registerNotification({
    id: NotificationIds.ActivitySkillRulesNotConfigured,
    type: Flex.NotificationType.error,
    content: StringTemplates.ActivitySkillRulesNotConfigured
  });
}
