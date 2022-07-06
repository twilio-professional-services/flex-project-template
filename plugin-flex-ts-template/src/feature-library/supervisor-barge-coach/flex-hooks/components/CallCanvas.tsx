import * as Flex from '@twilio/flex-ui';
import { UIAttributes } from 'types/manager/ServiceConfiguration';
import CoachingStatusPanel from '../../custom-components/CoachingStatusPanel'
import { cleanStateAndSyncUponAgentHangUp } from '../actions/Reservation';

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled, agent_coaching_panel} = custom_data.features.supervisor_barge_coach;


export function addSupervisorCoachingPanelToAgent(flex: typeof Flex, manager: Flex.Manager) {

  if(!enabled) return;
  if(!agent_coaching_panel) return;
  // Adding Coaching Status Panel to notify the agent who is Coaching them
  flex.CallCanvas.Content.add(
    <CoachingStatusPanel key="coaching-status-panel"> </CoachingStatusPanel>, {sortOrder: -1});

    //FIXME: This will likely get moved, but not certain exactly where to put it atm
    // Add a Listener to ReservationCreated
    cleanStateAndSyncUponAgentHangUp(flex, manager);
}
