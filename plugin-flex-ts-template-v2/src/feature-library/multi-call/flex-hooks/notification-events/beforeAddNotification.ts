import * as Flex from '@twilio/flex-ui';

export const eventName = Flex.NotificationEvent.beforeAddNotification;
export const notificationEventHook = (flex: typeof Flex, manager: Flex.Manager, notification: any, cancel: any) => {
  // Normally Flex only supports 1 call, so it shows an error notification upon receiving a second call.
  // We want to suppress this notification when multi-call is enabled
  if (notification.id === 'SecondVoiceCallIncoming') {
    cancel();
  }
};
