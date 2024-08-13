import * as Flex from '@twilio/flex-ui';

import { agentBrowserRefresh, supervisorBrowserRefresh } from '../../helpers/browserRefreshHelper';
import { isAgentCoachingPanelEnabled, isAgentAssistanceEnabled } from '../../config';
import { FlexEvent } from '../../../../types/feature-loader';
import { setBargeCoachStatus, SupervisorBargeCoachState } from '../states/SupervisorBargeCoachSlice';
import { reduxNamespace } from '../../../../utils/state';
import { SyncDoc } from '../../utils/sync/Sync';
import { AppState } from '../../../../types/manager';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = function initializeSyncDocs(_flex: typeof Flex, manager: Flex.Manager) {
  // Handle clearing Sync docs as appropriate after a browser refresh
  agentBrowserRefresh(isAgentCoachingPanelEnabled(), isAgentAssistanceEnabled());

  const { roles } = manager.user;
  if (roles.indexOf('admin') >= 0 || roles.indexOf('supervisor') >= 0) {
    supervisorBrowserRefresh();
  }

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
