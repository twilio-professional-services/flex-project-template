import * as Flex from '@twilio/flex-ui';

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  if (!hook.eventName) {
    console.info(`Feature ${feature} declared notification event hook, but is missing eventName to hook`);
    return;
  }
  const event = hook.eventName as Flex.NotificationEvent;

  console.info(
    `Feature ${feature} registered %c${event} %cnotification event hook: %c${hook.notificationEventHook.name}`,
    'font-weight:bold',
    'font-weight:normal',
    'font-weight:bold',
  );

  flex.Notifications.addListener(event, (notification, cancel) => {
    hook.notificationEventHook(flex, manager, notification, cancel);
  });
};
