import * as Flex from '@twilio/flex-ui';
import { NotificationType } from '@twilio/flex-ui';

export enum NotificationIds {
  ALERT = "is seeking assistance."
}

export const registerNotificaiton = (agentFN: string) => {
  const alertText = `${agentFN} ${NotificationIds.ALERT}`;

  Flex.Notifications.registerNotification({
    id: agentFN,
    closeButton: true,
    content: alertText,
    type: NotificationType.warning,
    timeout: 8000,
    onClick: (event) => navigateToTeamsView()
  });
  return;
}
export const showNotificaiton = (agentFN: string) => {
  Flex.Notifications.showNotification(agentFN);
  return;
}

export const registeredNotifications = (agentFN: string) => {
  Flex.Notifications.registeredNotifications.delete(agentFN);
  return;
}

const navigateToTeamsView = () => {
  Flex.Actions.invokeAction("NavigateToView", {viewName: "teams"});
  return;
}