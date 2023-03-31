import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings/ActivitySkillFilter';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum NotificationIds {
  ActivitySkillRulesNotConfigured = 'PSActivitySkillRulesNotConfigured',
}

export const notificationHook = (_flex: typeof Flex, _manager: Flex.Manager) => [
  {
    id: NotificationIds.ActivitySkillRulesNotConfigured,
    type: Flex.NotificationType.error,
    content: StringTemplates.ActivitySkillRulesNotConfigured,
  },
];
