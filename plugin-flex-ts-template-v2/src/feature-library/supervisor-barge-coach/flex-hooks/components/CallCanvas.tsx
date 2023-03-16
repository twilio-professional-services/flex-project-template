import * as Flex from '@twilio/flex-ui';
import CoachingStatusPanel from '../../custom-components/CoachingStatusPanel'
import AgentAssistanceButton from "../../custom-components/AgentAssistanceButton"
import { cleanStateAndSyncUponAgentHangUp } from '../actions/reservation';
import { isAgentAssistanceEnabled, isAgentCoachingPanelEnabled } from '../..';
import { agentBrowserRefresh } from '../../helpers/browserRefreshHelper';

export function addSupervisorCoachingPanelToAgent(flex: typeof Flex, manager: Flex.Manager) {

  if(!isAgentCoachingPanelEnabled()) return;
  // Adding Coaching Status Panel to notify the agent who is Coaching them
  flex.CallCanvas.Content.add(<CoachingStatusPanel key="coaching-status-panel"> </CoachingStatusPanel>, {sortOrder: -1});

  // Add a Listener to ReservationCreated
  cleanStateAndSyncUponAgentHangUp(flex, manager);

  if(!isAgentAssistanceEnabled()) return;

  agentBrowserRefresh();

  // Add the Agent Assistance Button to the CallCanvas
  flex.CallCanvas.Content.add(<AgentAssistanceButton key="agent-assistance-button"> </AgentAssistanceButton>, {sortOrder: 0});
}

