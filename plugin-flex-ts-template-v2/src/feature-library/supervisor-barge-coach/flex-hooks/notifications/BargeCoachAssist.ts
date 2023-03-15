import * as Flex from '@twilio/flex-ui';
import { NotificationType } from '@twilio/flex-ui';

export enum NotificationIds {
  ALERT = "is seeking assistance."
}

export default (flex: typeof Flex, manager: Flex.Manager) => {
}

export class AgentAssistanceNotificationsClass {

  registerNotificaiton = (agentFN: string) => {
    const alertText = `${agentFN} ${NotificationIds.ALERT}`;

    Flex.Notifications.registerNotification({
      id: agentFN,
      closeButton: true,
      content: alertText,
      type: NotificationType.warning,
      timeout: 8000,
      onClick: (event) => this.navigateToTeamsView()
    });
    return;
  }
  showNotificaiton = (agentFN: string) => {
    Flex.Notifications.showNotification(agentFN);
    return;
  }

  registeredNotifications = (agentFN: string) => {
    Flex.Notifications.registeredNotifications.delete(agentFN);
    return;
  }

  navigateToTeamsView = () => {
    Flex.Actions.invokeAction("NavigateToView", {viewName: "teams"});
    return;
  }
};

export const AgentAssistanceNotifications = new AgentAssistanceNotificationsClass();