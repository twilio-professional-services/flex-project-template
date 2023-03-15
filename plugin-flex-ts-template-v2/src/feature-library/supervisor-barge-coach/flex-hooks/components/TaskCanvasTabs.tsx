import * as Flex from '@twilio/flex-ui';
import SupervisorMonitorPanel from '../../custom-components/SupervisorMonitorPanel';
import { isSupervisorMonitorPanelEnabled } from '../..';
import { supervisorBrowserRefresh } from '../../helpers/browserRefreshHelper';

export function addSupervisorMonitorPanel(flex: typeof Flex, manager: Flex.Manager) {

  if(!isSupervisorMonitorPanelEnabled()) return;

  flex.Supervisor.TaskCanvasTabs.Content.add(
    <SupervisorMonitorPanel uniqueName="Supervisors Engaged" icon="AgentsBold"  key="supervisoronitorpanel" 
    />,
      {if: (props) => props.channelDefinition.capabilities.has('Call')}
  );
  
  supervisorBrowserRefresh();
}
