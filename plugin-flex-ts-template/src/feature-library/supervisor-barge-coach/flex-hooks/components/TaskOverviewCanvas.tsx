import * as Flex from '@twilio/flex-ui';
import { UIAttributes } from 'types/manager/ServiceConfiguration';
import { Actions as BargeCoachStatusAction, } from '../../flex-hooks/states/SupervisorBargeCoach';

// Used for Sync Docs
import { SyncDoc } from '../../utils/sync/Sync'

// Standard Barge Coach Feature
import SupervisorBargeCoachButton from '../../custom-components/BargeCoachButtons'

// Advancted Barge Coach Features
import SupervisorPrivateToggle from '../../custom-components/SupervisorPrivateModeButton'

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled, agent_coaching_panel } = custom_data.features.supervisor_barge_coach;


export function addSupervisorBargeCoachButtons(flex: typeof Flex, manager: Flex.Manager) {

  if(!enabled) return;

  
  // Add the Barge-in and Coach Option
  flex.Supervisor.TaskOverviewCanvas.Content.add(<SupervisorBargeCoachButton key="bargecoach-buttons" />);

  // we will lose the stickyWorker attribute that we use for agentWorkerSID (see \components\SupervisorBargeCoachButton.js for reference)
  // We need to invoke an action to trigger this again, so it populates the stickyWorker for us 
  const agentWorkerSID = manager.store.getState().flex?.supervisor?.stickyWorker?.worker?.sid;
  const teamViewPath = localStorage.getItem('teamViewPath');

  // Check that the stickyWorker is null and that we are attempting to restore the last worker they monitored
  if (agentWorkerSID == null && teamViewPath != null) {
    console.log(`${teamViewPath}`);

    // We are parsing the prop teamViewTaskPath into an array, split it between the '/',
    // then finding which object in the array starts with WR, which is the SID we need
    const arrayTeamView = teamViewPath.split('/');
    const teamViewTaskSID = arrayTeamView.filter(s => s.includes('WR'));
    console.log(`teamViewSID = ${teamViewTaskSID}`);

    // Invoke action to trigger the monitor button so we can populate the stickyWorker attribute
    console.log(`Triggering the invokeAction`);
    Flex.Actions.invokeAction("SelectTaskInSupervisor", { sid: teamViewTaskSID });

    // If agentSyncDoc exists, clear the Agent Sync Doc to account for the refresh
    const agentSyncDoc = localStorage.getItem('agentSyncDoc');
    if(agentSyncDoc != null) {
     SyncDoc.clearSyncDoc(agentSyncDoc);
    }

    // This is here if the Supervisor refreshes and has toggled alerts to false
    // By default alerts are enabled unless they toggle it off
    let privateToggle = localStorage.getItem('privateToggle');
    if (privateToggle === "false") {
        manager.store.dispatch(BargeCoachStatusAction.setBargeCoachStatus({ 
          coachingStatusPanel: false, 
        }));
    }
  }

  if(!agent_coaching_panel) return;
  // Add the Supervisor Private Mode Toggle
  flex.Supervisor.TaskOverviewCanvas.Content.add(<SupervisorPrivateToggle key="supervisorprviate-button" />);
}
