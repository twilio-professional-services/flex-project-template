import * as Flex from "@twilio/flex-ui";
import { Actions as BargeCoachStatusAction } from "../../states/SupervisorBargeCoach";
import { isAgentCoachingPanelEnabled } from '../../../config';
// Import to get Sync Doc updates
import { SyncDoc } from "../../../utils/sync/Sync";
import { FlexJsClient, WorkerEvent } from "../../../../../types/feature-loader";

export const clientName = FlexJsClient.workerClient;
export const eventName = WorkerEvent.reservationCreated;
// Listening for agent to hang up the call so we can clear the Sync Doc
// for the CoachStatePanel feature
export const jsClientHook = async function cleanStateAndSyncUponAgentHangUp(
  flex: typeof Flex,
  manager: Flex.Manager,
  reservation: any
) {
  // If agent_coaching_panel feature is true proceed, otherwise we will not subscribe to the Sync Doc
  if (!isAgentCoachingPanelEnabled()) return;
  
  //Register listener for reservation wrapup event
  reservation.on("wrapup", (reservation: any) => {
    console.log(`Hangup button triggered ${reservation}, clear the Sync Doc`);
    manager.store.dispatch(
      BargeCoachStatusAction.setBargeCoachStatus({
        enableCoachButton: false,
        coaching: false,
        enableBargeinButton: false,
        muted: true,
      })
    );
    const agentWorkerSID = manager.store.getState().flex?.worker?.worker?.sid;
    const agentSyncDoc = `syncDoc.${agentWorkerSID}`;
    // Let's clear the Sync Document and also close/end our subscription to the Document
    SyncDoc.clearSyncDoc(agentSyncDoc);
    SyncDoc.closeSyncDoc(agentSyncDoc);
  });
};
