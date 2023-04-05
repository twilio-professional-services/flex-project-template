import * as Flex from '@twilio/flex-ui';

import { AppState } from '../../../types/manager';
import { SyncDoc } from '../utils/sync/Sync';
import { Actions } from '../flex-hooks/states/SupervisorBargeCoach';

let _actionInvoked = false;

// Clean up Sync Docs and clean up state where applicable
export const agentBrowserRefresh = () => {
  const state = Flex.Manager.getInstance().store.getState() as AppState;
  // If myWorkerSID exists, clear the Agent Sync Docs to account for the refresh
  const myWorkerSID = localStorage.getItem('myWorkerSID') || null;
  const agentSyncDoc = `syncDoc.${myWorkerSID}`;
  if (myWorkerSID) {
    SyncDoc.clearSyncDoc(agentSyncDoc);
  }
  // This is here if the Agent refreshes in the middle of having Agent Assistance on
  // This will clear up the Sync Doc and delete the registered notification
  const cacheAgentAssistState = localStorage.getItem('cacheAgentAssistState');
  const agentWorkerSID = state.flex?.worker?.worker?.sid || null;
  if (cacheAgentAssistState === 'true' && agentWorkerSID !== null) {
    SyncDoc.initSyncDocAgentAssistance(agentWorkerSID, '', '', '', 'remove');
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
      Actions.setBargeCoachStatus({
        enableAgentAssistanceAlerts: false,
      }),
    );
  }
  // If the Supervisor refreshes and has private mode set to true we will store that
  // By default private mode is set to false
  const cachedPrivateMode = localStorage.getItem('privateMode');
  if (cachedPrivateMode === 'true') {
    Flex.Manager.getInstance().store.dispatch(
      Actions.setBargeCoachStatus({
        privateMode: true,
      }),
    );
  }
  // Only used for the coach feature if some reason the browser refreshes after the agent is being monitored
  // we will lose the stickyWorker attribute that we use for agentWorkerSID (see \components\SupervisorBargeCoachButton.js for reference)
  // We need to invoke an action to trigger this again, so it populates the stickyWorker for us
  const stickyWorkerSID = state.flex?.supervisor?.stickyWorker?.worker?.sid;
  const teamViewTaskSID = localStorage.getItem('teamViewTaskSID');

  // Check that the stickyWorker is null and that we are attempting to restore the last worker they monitored
  if (!stickyWorkerSID && teamViewTaskSID) {
    // Triggering the invokeAction to force a click to repopulate stickyWorker
    if (!_actionInvoked) {
      Flex.Actions.invokeAction('NavigateToView', { viewName: 'teams' });
      _actionInvoked = true;
    }
    const agentWorkerSID = localStorage.getItem('agentWorkerSID') || null;
    if (agentWorkerSID !== null) {
      const myWorkerSID = state.flex?.worker?.worker?.sid || '';
      const supervisorFN = state.flex?.worker?.attributes?.full_name || '';
      SyncDoc.initSyncDocSupervisors(agentWorkerSID, '', myWorkerSID, supervisorFN, '', 'remove');
    }
  }
  // This is here if the Supervisor refreshes and has toggled alerts to false
  // By default alerts set to true
  const privateToggle = localStorage.getItem('privateToggle');
  if (privateToggle === 'false') {
    Flex.Manager.getInstance().store.dispatch(
      Actions.setBargeCoachStatus({
        coachingStatusPanel: false,
      }),
    );
  }
};
