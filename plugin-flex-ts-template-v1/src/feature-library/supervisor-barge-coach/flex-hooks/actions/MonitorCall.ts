import * as Flex from '@twilio/flex-ui';
import { Actions as BargeCoachStatusAction, } from '../../flex-hooks/states/SupervisorBargeCoach';
import { UIAttributes } from 'types/manager/ServiceConfiguration';
// Import to get Sync Doc updates
import { SyncDoc } from '../../utils/sync/Sync'

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled, agent_coaching_panel, supervisor_monitor_panel } = custom_data.features.supervisor_barge_coach;

export const enableBargeCoachButtonsUponMonitor = async (flex: typeof Flex, manager: Flex.Manager) => {

    if(!enabled) return;
    // Listening for supervisor to monitor the call to enable the
    // barge and coach buttons, as well as reset their muted/coaching states
    flex.Actions.addListener('afterMonitorCall', (payload) => {

        console.log(`Monitor button triggered, enable the Coach and Barge-In Buttons`);
        manager.store.dispatch(BargeCoachStatusAction.setBargeCoachStatus({ 
            enableCoachButton: true,
            coaching: false,
            enableBargeinButton: true,
            muted: true
        }));

        // If the Supervisor Monitor Panel feature is enabled, we want to update the Sync Doc that we are monitoring
        // However we do not want to if privateMode is enabled by the Supervisor
        if (!supervisor_monitor_panel) return;
        const privateMode = manager.store.getState().custom?.supervisorBargeCoach?.privateMode;
        if (privateMode) return;

        const myWorkerSID = manager.store.getState().flex?.worker?.worker?.sid;
        const agentWorkerSID = manager.store.getState().flex?.supervisor?.stickyWorker?.worker?.sid;
        const supervisorFN = manager.store.getState().flex?.worker?.attributes?.full_name;
        const conferenceSID = payload.task?.conference?.conferenceSid;
        SyncDoc.initSyncDoc(agentWorkerSID, conferenceSID, myWorkerSID, supervisorFN, "is Monitoring", "add");
    });
}

export const disableBargeCoachButtonsUponMonitor = async (flex: typeof Flex, manager: Flex.Manager) => {

    if(!enabled) return;
    // Listening for supervisor to click to unmonitor the call to disable the
    // barge and coach buttons, as well as reset their muted/coaching states
    flex.Actions.addListener('afterStopMonitoringCall', (payload) => {
        console.log(`Unmonitor button triggered, disable the Coach and Barge-In Buttons`);
        manager.store.dispatch(BargeCoachStatusAction.setBargeCoachStatus({ 
            enableCoachButton: false,
            coaching: false,
            enableBargeinButton: false,
            muted: true,
            barge: false
        }));

        // If the Agent Coaching Panel and Supervisor Monitor Panel are disabled, we can skip otherwise
        // We need to update the Sync Doc to remove the Supervisor after they unmonitor the call
        if (!agent_coaching_panel && !supervisor_monitor_panel) return;

        const myWorkerSID = manager.store.getState().flex?.worker?.worker?.sid;
        const agentWorkerSID = manager.store.getState().flex?.supervisor?.stickyWorker?.worker?.sid;
        const supervisorFN = manager.store.getState().flex?.worker?.attributes?.full_name;
        SyncDoc.initSyncDoc(agentWorkerSID, "", myWorkerSID, supervisorFN, "", "remove");
    });
}
