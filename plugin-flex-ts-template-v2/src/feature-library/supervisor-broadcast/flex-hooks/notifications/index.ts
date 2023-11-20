import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum SupervisorBroadcastNotification {
  BROADCAST = 'supervisor-broadcast_broadcast',
  COMMAND = 'supervisor-broadcast_command',
}

// Return an array of Flex.Notification
export const notificationHook = (flex: typeof Flex, _manager: Flex.Manager) => [
  {
    id: SupervisorBroadcastNotification.BROADCAST,
    type: flex.NotificationType.warning,
    content: StringTemplates.BROADCAST_NOTIFICATION_TEMPLATE,
    timeout: 10000,
    closeButton: true,
  },
  {
    id: SupervisorBroadcastNotification.COMMAND,
    type: flex.NotificationType.warning,
    content: `Command from Supervisor: {{message}} was automatically run`,
    timeout: 10000,
    closeButton: true,
  },
];
