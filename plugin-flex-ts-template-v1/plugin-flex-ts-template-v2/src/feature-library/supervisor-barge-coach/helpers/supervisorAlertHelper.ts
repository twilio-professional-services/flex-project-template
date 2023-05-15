import * as Flex from '@twilio/flex-ui';

import { reduxNamespace } from '../../../utils/state';
import { AppState } from '../../../types/manager';
import { Actions } from '../flex-hooks/states/SupervisorBargeCoach';
import { SyncDoc } from '../utils/sync/Sync';
import { NotificationIds } from '../flex-hooks/notifications/BargeCoachAssist';

// When this is called, we will do checks to validate any new agents that need assistance
export const alertSupervisorsCheck = () => {
  const state = Flex.Manager.getInstance().store.getState() as AppState;
  const { agentAssistanceArray, enableAgentAssistanceAlerts } = state[reduxNamespace].supervisorBargeCoach;
  const arrayIndexCheck = agentAssistanceArray?.findIndex((agent: any) => agent.agentFN !== '');
  if (arrayIndexCheck > -1 && enableAgentAssistanceAlerts) {
    const agentFN = `${agentAssistanceArray[arrayIndexCheck].agentFN}`;
    Flex.Notifications.showNotification(NotificationIds.AGENT_ASSISTANCE, { agentFN: `${agentFN}` });
  } else {
    Flex.Notifications.dismissNotificationById(NotificationIds.AGENT_ASSISTANCE);
  }
};

export const syncUpdates = async () => {
  const state = Flex.Manager.getInstance().store.getState() as AppState;
  const { enableAgentAssistanceAlerts, agentAssistanceSyncSubscribed } = state[reduxNamespace].supervisorBargeCoach;

  if (enableAgentAssistanceAlerts && !agentAssistanceSyncSubscribed) {
    SyncDoc.getSyncDoc('Agent-Assistance').then((doc: any) => {
      // Update the redux store/state with the latest array of agents needing assistance
      Flex.Manager.getInstance().store.dispatch(
        Actions.setBargeCoachStatus({
          agentAssistanceArray: doc.data.agentAssistance,
        }),
      );
      alertSupervisorsCheck();

      // We are subscribing to Sync Doc updates here and logging anytime that happens
      doc.on('updated', (doc: any) => {
        // Every time we get an update on the Sync Doc, update the redux store/state
        // with the latest array of agents needing assistance
        Flex.Manager.getInstance().store.dispatch(
          Actions.setBargeCoachStatus({
            agentAssistanceArray: doc.data.agentAssistance,
          }),
        );
        alertSupervisorsCheck();
      });
    });
    // Setting agentAssistanceSyncSubscribed to true so we don't attempt more sync update/subscribes
    Flex.Manager.getInstance().store.dispatch(
      Actions.setBargeCoachStatus({
        agentAssistanceSyncSubscribed: true,
      }),
    );
  }
};
