import * as Flex from '@twilio/flex-ui';

import CoachingStatusPanel from '../../custom-components/CoachingStatusPanel';
import AgentAssistanceButton from '../../custom-components/AgentAssistanceButton';
import { isAgentAssistanceEnabled, isAgentCoachingPanelEnabled } from '../../config';
import { agentBrowserRefresh } from '../../helpers/browserRefreshHelper';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.CallCanvas;
export const componentHook = function addSupervisorCoachingPanelToAgent(flex: typeof Flex, _manager: Flex.Manager) {
  if (!isAgentCoachingPanelEnabled()) return;
  // Adding Coaching Status Panel to notify the agent who is Coaching them
  flex.CallCanvas.Content.add(<CoachingStatusPanel key="coaching-status-panel"> </CoachingStatusPanel>, {
    sortOrder: -1,
  });

  if (!isAgentAssistanceEnabled()) return;

  agentBrowserRefresh();

  // Add the Agent Assistance Button to the CallCanvas
  flex.CallCanvas.Content.add(<AgentAssistanceButton key="agent-assistance-button"> </AgentAssistanceButton>, {
    sortOrder: 0,
  });
};
