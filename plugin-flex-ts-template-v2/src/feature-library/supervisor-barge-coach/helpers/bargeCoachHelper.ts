import { Manager } from '@twilio/flex-ui';

import BargeCoachService from '../utils/serverless/BargeCoachService';
import {
  SupervisorBargeCoachState,
  barge,
  coach,
  listen,
  setBargeCoachStatus,
} from '../flex-hooks/states/SupervisorBargeCoachSlice';
import { isAgentCoachingPanelEnabled } from '../config';
import { SyncDoc } from '../utils/sync/Sync';
import { AppState } from '../../../types/manager';
import { reduxNamespace } from '../../../utils/state';

export const subscribeAgentDoc = (manager: Manager) => {
  // Handle subscribing to the worker's Sync doc
  if (!manager.workerClient) {
    // Need the worker SID in order to subscribe
    return;
  }
  // Let's subscribe to the sync doc as an agent/worker and check
  // if we are being coached, so that we can render that in the UI
  const mySyncDoc = `syncDoc.${manager.workerClient.workerSid}`;
  SyncDoc.getSyncDoc(mySyncDoc).then((doc: any) => {
    // We are subscribing to Sync Doc updates here and logging anytime that happens
    doc.on('updated', (doc: any) => {
      const { supervisorArray } = (manager.store.getState() as AppState)[reduxNamespace]
        .supervisorBargeCoach as SupervisorBargeCoachState;
      let newSupervisorArray: any[] = [];
      if (doc.data.supervisors) {
        // Current version of this feature will only show the Agent they are being coached
        // This could be updated by removing the below logic and including Monitoring and Barge
        newSupervisorArray = doc.data.supervisors.filter(
          (supervisor: any) => supervisor.status !== 'barge' && supervisor.status !== 'monitoring',
        );
      }

      // Set Supervisor's name that is coaching into props
      if (newSupervisorArray.length !== 0 || supervisorArray.length !== 0) {
        manager.store.dispatch(
          setBargeCoachStatus({
            supervisorArray: newSupervisorArray,
          }),
        );
      }
    });
  });
  // Caching this if the browser is refreshed while the agent actively on a call
  // We will use this to clear up the Sync Doc upon browser refresh
  localStorage.setItem('myWorkerSID', `${manager.workerClient.workerSid}`);
};

export const enterListenMode = async (conferenceSid: string, participantSid?: string) => {
  // Called without participantSid by MonitorCall, in that case we only need to set states rather than call an API
  if (participantSid) {
    await BargeCoachService.updateParticipantBargeCoach(conferenceSid, participantSid, '', true, false);
  }
  updateSyncDoc(conferenceSid, 'monitoring');
  Manager.getInstance().store.dispatch(listen());
};

export const enterBargeMode = async (conferenceSid: string, participantSid: string, agentCallSid: string) => {
  await BargeCoachService.updateParticipantBargeCoach(conferenceSid, participantSid, agentCallSid, false, false);
  updateSyncDoc(conferenceSid, 'barge');
  Manager.getInstance().store.dispatch(barge());
};

export const enterCoachMode = async (conferenceSid: string, participantSid: string, agentCallSid: string) => {
  await BargeCoachService.updateParticipantBargeCoach(conferenceSid, participantSid, agentCallSid, false, true);
  updateSyncDoc(conferenceSid, 'coaching');
  Manager.getInstance().store.dispatch(coach());
};

const updateSyncDoc = (conferenceSid: string, supervisorStatus: string) => {
  const state = Manager.getInstance().store.getState();
  const { privateMode } = (state as AppState)[reduxNamespace].supervisorBargeCoach;

  // If agent_coaching_panel is true (enabled), proceed
  // otherwise we will not update to the Sync Doc
  if (!isAgentCoachingPanelEnabled() || privateMode) {
    return;
  }

  const agentWorkerSID = state.flex.supervisor?.callMonitoring?.task?.workerSid || '';
  const myWorkerSID = state.flex.worker?.worker?.sid || '';
  const supervisorFN = state.flex.worker?.attributes?.full_name || '';

  SyncDoc.initSyncDocSupervisors(agentWorkerSID, conferenceSid, myWorkerSID, supervisorFN, supervisorStatus, 'update');

  // Set the agent to local storage for later use in browserRefreshHelper in case the page is reloaded during monitoring
  localStorage.setItem('agentWorkerSID', agentWorkerSID);
};
