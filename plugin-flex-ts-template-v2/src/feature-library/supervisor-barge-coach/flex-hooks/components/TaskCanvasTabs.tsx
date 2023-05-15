import * as Flex from '@twilio/flex-ui';

import SupervisorMonitorPanel from '../../custom-components/SupervisorMonitorPanel';
import { isSupervisorMonitorPanelEnabled } from '../../config';
import { FlexComponent } from '../../../../types/feature-loader';
import { supervisorBrowserRefresh } from '../../helpers/browserRefreshHelper';

export const componentName = FlexComponent.TaskCanvasTabs;
export const componentHook = function addSupervisorMonitorPanel(flex: typeof Flex, _manager: Flex.Manager) {
  if (!isSupervisorMonitorPanelEnabled()) return;

  flex.Supervisor.TaskCanvasTabs.Content.add(
    <SupervisorMonitorPanel uniqueName="Supervisors Engaged" icon="AgentsBold" key="SupervisorMonitorPanel" />,
    { if: (props) => props.channelDefinition.capabilities.has('Call') },
  );

  supervisorBrowserRefresh();
};
