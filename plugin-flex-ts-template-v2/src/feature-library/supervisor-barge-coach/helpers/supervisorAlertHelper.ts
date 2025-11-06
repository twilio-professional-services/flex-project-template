import * as Flex from '@twilio/flex-ui';

import { reduxNamespace } from '../../../utils/state';
import { setBargeCoachStatus } from '../flex-hooks/states/SupervisorBargeCoachSlice';
import { AppState } from '../../../types/manager';
import { SyncDoc } from '../utils/sync/Sync';
import { NotificationIds } from '../flex-hooks/notifications/BargeCoachAssist';

let doc: any = null;
let agentSubscribed = false;

// When this is called, we will do checks to validate any new agents that need assistance
export const alertSupervisorsCheck = () => {
  const state = Flex.Manager.getInstance().store.getState() as AppState;
  const { agentAssistanceArray, enableAgentAssistanceAlerts } = state[reduxNamespace].supervisorBargeCoach;

  // Clear any existing notifications
  Flex.Notifications.dismissNotificationById(NotificationIds.AGENT_ASSISTANCE);

  // If enabled, show notifications for each agent requesting assistance
  // As a customization, this could be further filtered by team etc.
  if (enableAgentAssistanceAlerts) {
    const agents = agentAssistanceArray?.filter((agent: any) => agent.agentFN !== '') ?? [];
    for (const agent of agents) {
      Flex.Notifications.showNotification(NotificationIds.AGENT_ASSISTANCE, agent);
    }
  }
};

const handleDocUpdateAgent = (doc: any) => {
  const state = Flex.Manager.getInstance().store.getState() as AppState;
  const { agentAssistanceButton } = state[reduxNamespace].supervisorBargeCoach;
  const agentWorkerSID = state?.flex?.worker?.worker?.sid;
  if (!agentWorkerSID || !doc?.data?.agentAssistance) {
    return;
  }

  // Set button state based on agent existing in doc
  const agentIndex = doc.data.agentAssistance.findIndex((a: any) => a.agentWorkerSID === agentWorkerSID);
  const assistanceRequested = agentIndex >= 0;

  if (agentAssistanceButton && assistanceRequested) {
    // Do nothing if the value is unchanged
    return;
  }

  Flex.Manager.getInstance().store.dispatch(
    setBargeCoachStatus({
      agentAssistanceButton: assistanceRequested,
    }),
  );
  // Caching this to help with browser refresh recovery
  localStorage.setItem('cacheAgentAssistState', `${assistanceRequested}`);

  if (!assistanceRequested) {
    // We can unsubscribe if assistance was turned off
    syncStopAgent();
  }
};

const handleDocUpdateSupervisor = (doc: any) => {
  // Update the redux store/state with the latest array of agents needing assistance
  Flex.Manager.getInstance().store.dispatch(
    setBargeCoachStatus({
      agentAssistanceArray: doc.data.agentAssistance,
    }),
  );
  alertSupervisorsCheck();
};

export const syncUpdatesAgent = async () => {
  if (agentSubscribed) {
    return;
  }

  if (doc === null) {
    doc = await SyncDoc.getSyncDoc('Agent-Assistance');
  }

  doc.on('updated', handleDocUpdateAgent);
  agentSubscribed = true;
};

export const syncStopAgent = () => {
  if (!agentSubscribed || !doc) {
    return;
  }

  doc.off('updated', handleDocUpdateAgent);
  agentSubscribed = false;
};

export const syncUpdatesSupervisor = async () => {
  if (doc === null) {
    doc = await SyncDoc.getSyncDoc('Agent-Assistance');
  }

  // Get the initial data
  handleDocUpdateSupervisor(doc);

  // We are subscribing to Sync Doc updates here
  doc.on('updated', handleDocUpdateSupervisor);
};
