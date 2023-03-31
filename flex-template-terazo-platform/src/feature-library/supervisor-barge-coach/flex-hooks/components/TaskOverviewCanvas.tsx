import * as Flex from '@twilio/flex-ui';

import { supervisorBrowserRefresh } from '../../helpers/browserRefreshHelper';
import { isAgentCoachingPanelEnabled } from '../../config';
import SupervisorBargeCoachButton from '../../custom-components/BargeCoachButtons';
import SupervisorPrivateToggle from '../../custom-components/SupervisorPrivateModeButton';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.TaskOverviewCanvas;
export const componentHook = function addSupervisorBargeCoachButtons(flex: typeof Flex, _manager: Flex.Manager) {
  supervisorBrowserRefresh();

  // Add the Barge-in and Coach Option
  flex.Supervisor.TaskOverviewCanvas.Content.add(<SupervisorBargeCoachButton key="bargecoach-buttons" />);

  if (!isAgentCoachingPanelEnabled()) return;
  // Add the Supervisor Private Mode Toggle
  flex.Supervisor.TaskOverviewCanvas.Content.add(<SupervisorPrivateToggle key="supervisorprviate-button" />);
};
