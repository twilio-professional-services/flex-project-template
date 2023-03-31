import * as Flex from '@twilio/flex-ui';

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  console.info(`Feature ${feature} registered notification hook: %c${hook.notificationHook.name}`, 'font-weight:bold');
  // Returns array of notification definitions to register
  const notifications = hook.notificationHook(flex, manager) as [Flex.Notification];
  notifications.forEach((notification) => {
    flex.Notifications.registerNotification(notification);
  });
};
