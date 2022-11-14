import * as Flex from '@twilio/flex-ui';
import { UIAttributes } from 'types/manager/ServiceConfiguration';
import CoachingStatusPanel from '../../custom-components/CoachingStatusPanel'
import { cleanStateAndSyncUponAgentHangUp } from '../actions/reservation';
import { SyncDoc } from '../../utils/sync/Sync'

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled, agent_coaching_panel } = custom_data.features.supervisor_barge_coach;


export function addSupervisorCoachingPanelToAgent(flex: typeof Flex, manager: Flex.Manager) {

  if(!enabled) return;
  if(!agent_coaching_panel) return;
  // Adding Coaching Status Panel to notify the agent who is Coaching them
  flex.CallCanvas.Content.add(
    <CoachingStatusPanel key="coaching-status-panel"> </CoachingStatusPanel>, {sortOrder: -1});

    // If myWorkerSID exists, clear the Agent Sync Doc to account for the refresh
    const myWorkerSID = localStorage.getItem('myWorkerSID');
    if(myWorkerSID != null) {
      SyncDoc.clearSyncDoc(myWorkerSID);
    }

    // Add a Listener to ReservationCreated
    cleanStateAndSyncUponAgentHangUp(flex, manager);
}
