import * as Flex from '@twilio/flex-ui';

import logger from '../logger';

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  if (!hook.eventName) {
    logger.debug(`Feature ${feature} declared notification event hook, but is missing eventName to hook`);
    return;
  }
  const event = hook.eventName as Flex.NotificationEvent;

  logger.debug(`Feature ${feature} registered ${event} notification event hook: ${hook.notificationEventHook.name}`);

  flex.Notifications.addListener(event, (notification, cancel) => {
    hook.notificationEventHook(flex, manager, notification, cancel);
  });
};
