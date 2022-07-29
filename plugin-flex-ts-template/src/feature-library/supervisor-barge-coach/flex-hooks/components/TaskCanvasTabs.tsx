import * as Flex from '@twilio/flex-ui';
import { UIAttributes } from 'types/manager/ServiceConfiguration';

import SupervisorMonitorPanel from '../../custom-components/SupervisorMonitorPanel'

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled, supervisor_monitor_panel } = custom_data.features.supervisor_barge_coach;


export function addSupervisorMonitorPanel(flex: typeof Flex, manager: Flex.Manager) {

  if(!enabled) return;
  if(!supervisor_monitor_panel) return;

  // Add the Supervisor Monitor Panel
  flex.Supervisor.TaskCanvasTabs.Content.add(<SupervisorMonitorPanel title= "Supervisors Engaged" icon="Supervisor" key="supervisoronitorpanel" />);
  
}
