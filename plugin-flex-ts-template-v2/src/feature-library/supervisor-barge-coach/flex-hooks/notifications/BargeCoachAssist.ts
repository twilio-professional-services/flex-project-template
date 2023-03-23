import * as Flex from '@twilio/flex-ui';
import { StringTemplates } from '../strings/BargeCoachAssist';

export enum NotificationIds {
  AGENT_ASSISTANCE = 'AgentAssistanceTriggered'
}
// Return an array of Flex.Notification
export const notificationHook = (flex: typeof Flex, manager: Flex.Manager, context: any) => [
  {
    id: NotificationIds.AGENT_ASSISTANCE,
    closeButton: true,
    content: StringTemplates.AGENT_ASSISTANCE,
    type: Flex.NotificationType.warning,
    timeout: 8000,
    onClick: () => navigateToTeamsView()
  },
];

const navigateToTeamsView = () => {
  Flex.Actions.invokeAction("NavigateToView", {viewName: "teams"});
  return;
}