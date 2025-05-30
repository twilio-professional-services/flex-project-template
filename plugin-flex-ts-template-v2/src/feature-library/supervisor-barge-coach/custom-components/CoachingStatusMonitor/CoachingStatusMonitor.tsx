import { useEffect, useState } from 'react';
import { useFlexSelector, Manager } from '@twilio/flex-ui';

import { listen } from '../../flex-hooks/states/SupervisorBargeCoachSlice';
import { isAgentCoachingPanelEnabled, isSupervisorMonitorPanelEnabled } from '../../config';
import { SyncDoc } from '../../utils/sync/Sync';

// Use this component to update state and clear the Sync doc when monitoring ends. We listen to Flex state rather than StopMonitoringCall because the monitor call leg could be disconnected by external factors (i.e. connection issue, hangup from a SIP or PSTN device, etc)
export const CoachingStatusMonitor = () => {
  const [monitoredAgentWorkerSid, setMonitoredAgentWorkerSid] = useState('');

  const myWorkerSID = useFlexSelector((state) => state?.flex?.worker?.worker?.sid) || '';
  const monitoringState = useFlexSelector((state) => state?.flex?.supervisor?.callMonitoring?.status) || 0;
  const monitoringTask = useFlexSelector((state) => state?.flex?.supervisor?.callMonitoring?.task);

  const handleStopMonitoring = () => {
    // Reset redux state
    Manager.getInstance().store.dispatch(listen());

    // If the Agent Coaching Panel and Supervisor Monitor Panel are disabled, we can skip. Otherwise,
    // we need to update the Sync doc to remove the supervisor after they stop monitoring the call
    if (!isAgentCoachingPanelEnabled() && !isSupervisorMonitorPanelEnabled()) return;
    SyncDoc.initSyncDocSupervisors(monitoredAgentWorkerSid, '', myWorkerSID, '', '', 'remove');

    // Remove the agent we monitored from local storage
    localStorage.removeItem('agentWorkerSID');
  };

  useEffect(() => {
    if (monitoringState === 2 && monitoringTask?.sid) {
      // A task is being monitored
      setMonitoredAgentWorkerSid(monitoringTask.workerSid);
      return;
    }

    if (!monitoredAgentWorkerSid) {
      return;
    }

    // A task was previously monitored but isn't any more.
    handleStopMonitoring();
    setMonitoredAgentWorkerSid('');
  }, [monitoringState, monitoringTask]);

  return null;
};
