import * as Flex from '@twilio/flex-ui';
import { UIAttributes } from 'types/manager/ServiceConfiguration';
import SupervisorMonitorPanel from '../../custom-components/SupervisorMonitorPanel';
import { SyncDoc } from '../../utils/sync/Sync';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled = false, supervisor_monitor_panel = false } = custom_data?.features?.supervisor_barge_coach || {}


export function addSupervisorMonitorPanel(flex: typeof Flex, manager: Flex.Manager) {

  if(!enabled) return;
  if(!supervisor_monitor_panel) return;

  flex.Supervisor.TaskCanvasTabs.Content.add(<SupervisorMonitorPanel uniqueName="Supervisors Engaged" icon="AgentsBold"  key="supervisoronitorpanel" />);
  
  // If myWorkerSID exists, clear the Agent Sync Doc to account for the refresh
  const myWorkerSID = localStorage.getItem('myWorkerSID');
  if(myWorkerSID != null) {
    SyncDoc.clearSyncDoc(myWorkerSID);
  }
}
