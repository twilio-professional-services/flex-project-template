import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings/BargeCoachAssist';

export enum NotificationIds {
  AGENT_ASSISTANCE = 'AgentAssistanceTriggered',
}
// Return an array of Flex.Notification
export const notificationHook = (flex: typeof Flex, _manager: Flex.Manager) => [
  {
    id: NotificationIds.AGENT_ASSISTANCE,
    closeButton: true,
    content: StringTemplates.AgentAssistanceNotification,
    type: flex.NotificationType.warning,
    timeout: 8000,
    onClick: navigateToTeamsView,
    actions: [
      <Flex.NotificationBar.Action label={StringTemplates.AssistanceShowTaskDetails} onClick={navigateToTask} />,
    ],
  },
];

const navigateToTeamsView = async () => {
  await Flex.Actions.invokeAction('NavigateToView', { viewName: 'teams' });
};

const navigateToTask = async (_event: any, notification: Flex.Notification) => {
  const { workers } = Flex.Manager.getInstance().store.getState()?.flex.supervisor;
  const workerIndex = workers.findIndex((worker) => worker.worker?.sid === notification.context?.agentWorkerSID);
  if (workerIndex < 0) {
    // Teams view has not been initialized or is filtered such that this worker is not subscribed
    // Instead navigate to the view and keep the notification visible so the supervisor can locate the worker
    await navigateToTeamsView();
    return;
  }

  await Flex.Actions.invokeAction('SelectTaskInSupervisor', { sid: notification.context?.selectedTaskSID });
  Flex.Notifications.dismissNotification(notification);
};
