import * as Flex from '@twilio/flex-ui';
import { Actions as BargeCoachStatusAction, } from '../../flex-hooks/states/SupervisorBargeCoach';
import { UIAttributes } from 'types/manager/ServiceConfiguration';
//FIXME: Fix sync later
//import { SyncDoc } from '../services/Sync'

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled } = custom_data.features.supervisor_barge_coach;

export interface EventPayload {
    task?: Flex.ITask;
    sid?: string;
}

export const enableBargeCoachButtonsUponMonitor = async (flex: typeof Flex, manager: Flex.Manager) => {

    if(!enabled) return;

    //FIXME: For Testing Only remove later
    console.warn(`I'm in the Monitor Call Listener`);
    // Listening for supervisor to monitor the call to enable the
    // barge and coach buttons, as well as reset their muted/coaching states
    Flex.Actions.addListener('afterMonitorCall', (payload) => {
        //FIXME: For Testing Only remove later
        console.warn(`Monitor button triggered, enable the Coach and Barge-In Buttons`);

        console.log(`Monitor button triggered, enable the Coach and Barge-In Buttons`);
        manager.store.dispatch(BargeCoachStatusAction.setBargeCoachStatus({ 
            enableCoachButton: true,
            coaching: false,
            enableBargeinButton: true,
            muted: true 
        }));
    });

}

export const disableBargeCoachButtonsUponMonitor = async (flex: typeof Flex, manager: Flex.Manager) => {

    if(!enabled) return;

    // Listening for supervisor to click to unmonitor the call to disable the
    // barge and coach buttons, as well as reset their muted/coaching states
    Flex.Actions.addListener('afterStopMonitoringCall', (payload) => {
        console.log(`Unmonitor button triggered, disable the Coach and Barge-In Buttons`);
        manager.store.dispatch(BargeCoachStatusAction.setBargeCoachStatus({ 
            enableCoachButton: false,
            coaching: false,
            enableBargeinButton: false,
            muted: true 
        }));
        // Capture some info so we can remove the supervisor from the Sync Doc
        const agentWorkerSID = manager.store.getState().flex?.supervisor?.stickyWorker?.worker?.sid;
        const supervisorFN = manager.store.getState().flex?.worker?.attributes?.full_name;
        // Sending the agentWorkerSID so we know which Sync Doc to update, the Supervisor's Full Name, and the remove status
        // We don't care about the second or forth section in here as we are removing the Supervisor in this case
        // Typcially we would pass in the conferenceSID and what the supervisor is doing (see SupervisorBargeCoachButton.js if you wish to see that in use)
        //FIXME: Fix Sync later
        //SyncDoc.initSyncDoc(agentWorkerSID, "", supervisorFN, "", "remove");
    });

}