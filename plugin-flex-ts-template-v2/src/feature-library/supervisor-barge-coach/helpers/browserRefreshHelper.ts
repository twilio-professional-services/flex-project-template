import * as Flex from '@twilio/flex-ui';

import { AppState } from '../../../types/manager';
import { SyncDoc } from '../utils/sync/Sync';
import { setBargeCoachStatus } from '../flex-hooks/states/SupervisorBargeCoachSlice';

// Clean up Sync Docs and clean up state where applicable
export const agentBrowserRefresh = (clearCoachingDoc: boolean, clearAssistanceDoc: boolean) => {
  const state = Flex.Manager.getInstance().store.getState() as AppState;
  if (clearCoachingDoc) {
    // If myWorkerSID exists, clear the Agent Sync Docs to account for the refresh
    const myWorkerSID = localStorage.getItem('myWorkerSID') || null;
    const agentSyncDoc = `syncDoc.${myWorkerSID}`;
    if (myWorkerSID) {
      SyncDoc.clearSyncDoc(agentSyncDoc);
    }
  }
  if (clearAssistanceDoc) {
    // This is here if the Agent refreshes in the middle of having Agent Assistance on
    // This will clear up the Sync Doc and delete the registered notification
    const cacheAgentAssistState = localStorage.getItem('cacheAgentAssistState');
    const agentWorkerSID = state.flex?.worker?.worker?.sid || null;
    if (cacheAgentAssistState === 'true' && agentWorkerSID !== null) {
      SyncDoc.initSyncDocAgentAssistance(agentWorkerSID, '', '', '', 'remove');
    }
  }
};

// Clean up Sync Docs and clean up state where applicable
export const supervisorBrowserRefresh = async () => {
  const state = Flex.Manager.getInstance().store.getState() as AppState;
  // This is here if the Supervisor refreshes and has toggled alerts to false
  // By default alerts are set to true
  const cachedAlert = localStorage.getItem('cacheAlerts');
  if (cachedAlert === 'false') {
    Flex.Manager.getInstance().store.dispatch(
      setBargeCoachStatus({
        enableAgentAssistanceAlerts: false,
      }),
    );
  }
  // If the Supervisor refreshes and has private mode set to true we will store that
  // By default private mode is set to false
  const cachedPrivateMode = localStorage.getItem('privateMode');
  if (cachedPrivateMode === 'true') {
    Flex.Manager.getInstance().store.dispatch(
      setBargeCoachStatus({
        privateMode: true,
      }),
    );
  }
  // Only used for the coach feature if the browser refreshes while the agent is being monitored
  // Remove ourselves from the Sync doc for the agent that was being monitored
  const agentWorkerSID = localStorage.getItem('agentWorkerSID') || null;
  if (agentWorkerSID !== null) {
    const myWorkerSID = state.flex?.worker?.worker?.sid || '';
    SyncDoc.initSyncDocSupervisors(agentWorkerSID, '', myWorkerSID, '', '', 'remove');
    localStorage.removeItem('agentWorkerSID');
  }
};
