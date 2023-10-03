Use a notification event hook to add your own handler for various [Flex Notification Manager events](https://assets.flex.twilio.com/docs/releases/flex-ui/2.1.0/nsa/NotificationManager/#exports.NotificationEvent).

```ts
import * as Flex from "@twilio/flex-ui";

export const eventName = Flex.NotificationEvent.beforeAddNotification;
export const notificationEventHook = (
  flex: typeof Flex,
  manager: Flex.Manager,
  notification: any,
  cancel: any
) => {
  // your code here
};
```