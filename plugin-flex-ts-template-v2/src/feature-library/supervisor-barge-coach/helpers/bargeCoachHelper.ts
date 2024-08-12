import { Manager } from '@twilio/flex-ui';

import BargeCoachService from '../utils/serverless/BargeCoachService';
import { barge, coach, listen } from '../flex-hooks/states/SupervisorBargeCoachSlice';
import { isAgentCoachingPanelEnabled } from '../config';
import { SyncDoc } from '../utils/sync/Sync';
import { AppState } from '../../../types/manager';
import { reduxNamespace } from '../../../utils/state';

export const enterListenMode = async (conferenceSid: string, participantSid?: string) => {
  // Called without participantSid by MonitorCall, in that case we only need to set states rather than call an API
  if (participantSid) {
    await BargeCoachService.updateParticipantBargeCoach(conferenceSid, participantSid, '', true, false);
  }
  updateSyncDoc(conferenceSid, 'monitoring');
  Manager.getInstance().store.dispatch(listen());
};

export const enterBargeMode = async (conferenceSid: string, participantSid: string) => {
  await BargeCoachService.updateParticipantBargeCoach(conferenceSid, participantSid, '', false, false);
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
