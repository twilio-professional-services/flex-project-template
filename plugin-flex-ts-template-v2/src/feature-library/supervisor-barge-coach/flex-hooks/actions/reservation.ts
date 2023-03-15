import * as Flex from "@twilio/flex-ui";
import { Actions as BargeCoachStatusAction } from "../states/SupervisorBargeCoach";
import { isAgentAssistanceEnabled, isAgentCoachingPanelEnabled } from '../..';
import { SyncDoc } from "../../utils/sync/Sync";

export const cleanStateAndSyncUponAgentHangUp = async (
  flex: typeof Flex,
  manager: Flex.Manager
) => {
  // If agent_coaching_panel feature is true proceed, otherwise we will not subscribe to the Sync Doc
  if (!isAgentCoachingPanelEnabled()) return;

  // Listening for agent to hang up the call so we can clear the Sync Doc
  // for the CoachStatePanel and Agent Assistance feature
  manager.workerClient?.on("reservationCreated", (reservation: any) => {
    //Register listener for reservation wrapup event
    reservation.on("wrapup", (reservation: any) => {
      manager.store.dispatch(
        BargeCoachStatusAction.setBargeCoachStatus({
          enableCoachButton: false,
          coaching: false,
          enableBargeinButton: false,
          muted: true,
          agentAssistanceButton: false,
          syncSubscribed: false,
          agentAssistanceSyncSubscribed: false
        })
      );
      const agentWorkerSID = manager.store.getState().flex?.worker?.worker?.sid;
      const agentSyncDoc = `syncDoc.${agentWorkerSID}`;
      // Let's clear the Sync Document and also close/end our subscription to the Document
      SyncDoc.clearSyncDoc(agentSyncDoc);

      if (!isAgentAssistanceEnabled()) return;
      SyncDoc.initSyncDocAgentAssistance(agentWorkerSID, "", "", "", "remove");
    });
  });
};
