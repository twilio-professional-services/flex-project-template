import * as Flex from '@twilio/flex-ui';

import { isAgentAssistanceEnabled, isAgentCoachingPanelEnabled } from '../../../config';
import { SyncDoc } from '../../../utils/sync/Sync';
import { FlexJsClient, WorkerEvent } from '../../../../../types/feature-loader';
import { setBargeCoachStatus } from '../../states/SupervisorBargeCoachSlice';

export const clientName = FlexJsClient.workerClient;
export const eventName = WorkerEvent.reservationCreated;
export const jsClientHook = async function cleanStateAndSyncUponAgentHangUp(
  _flex: typeof Flex,
  manager: Flex.Manager,
  reservation: any,
) {
  // If agent_coaching_panel feature is true proceed, otherwise we will not subscribe to the Sync Doc
  if (!isAgentCoachingPanelEnabled()) return;

  // Listening for agent to hang up the call so we can clear the Sync Doc
  // for the CoachStatePanel and Agent Assistance feature
  // Register listener for reservation wrapup event
  reservation.on('wrapup', (_reservation: any) => {
    manager.store.dispatch(
      setBargeCoachStatus({
        agentAssistanceButton: false,
      }),
    );
    const agentWorkerSID = manager.store.getState().flex?.worker?.worker?.sid || '';
    const agentSyncDoc = `syncDoc.${agentWorkerSID}`;
    // Let's clear the Sync Document
    SyncDoc.clearSyncDoc(agentSyncDoc);

    if (!isAgentAssistanceEnabled()) return;
    SyncDoc.initSyncDocAgentAssistance(agentWorkerSID, '', '', '', 'remove');
  });
};
