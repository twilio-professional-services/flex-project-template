import * as Flex from '@twilio/flex-ui';

import logger from '../logger';

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  logger.debug(`Feature ${feature} registered notification hook: ${hook.notificationHook.name}`);
  // Returns array of notification definitions to register
  const notifications = hook.notificationHook(flex, manager) as [Flex.Notification];
  notifications.forEach((notification) => {
    flex.Notifications.registerNotification(notification);
  });
};
