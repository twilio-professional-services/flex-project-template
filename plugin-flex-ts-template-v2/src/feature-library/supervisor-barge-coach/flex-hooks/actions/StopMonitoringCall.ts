import * as Flex from '@twilio/flex-ui';

import { listen } from '../states/SupervisorBargeCoachSlice';
import { isAgentCoachingPanelEnabled, isSupervisorMonitorPanelEnabled } from '../../config';
import { SyncDoc } from '../../utils/sync/Sync';
import { FlexAction, FlexActionEvent } from '../../../../types/feature-loader';

export const actionName = FlexAction.StopMonitoringCall;
export const actionEvent = FlexActionEvent.after;
export const actionHook = async function disableBargeCoachButtonsUponMonitor(flex: typeof Flex, manager: Flex.Manager) {
  // Listening for supervisor to click to unmonitor the call to reset their muted/coaching states
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    // Reset redux state
    manager.store.dispatch(listen());
    // If the Agent Coaching Panel and Supervisor Monitor Panel are disabled, we can skip otherwise
    // We need to update the Sync Doc to remove the Supervisor after they unmonitor the call
    if (!isAgentCoachingPanelEnabled() && !isSupervisorMonitorPanelEnabled()) return;

    const myWorkerSID = manager.store.getState().flex?.worker?.worker?.sid || '';
    const agentWorkerSID = payload.task?.workerSid || '';
    SyncDoc.initSyncDocSupervisors(agentWorkerSID, '', myWorkerSID, '', '', 'remove');

    // Remove the agent we monitored from local storage
    localStorage.removeItem('agentWorkerSID');
  });
};
