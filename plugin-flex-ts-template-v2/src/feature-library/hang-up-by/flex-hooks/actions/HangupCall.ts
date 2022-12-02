import * as Flex from "@twilio/flex-ui";
import { isFeatureEnabled } from "../..";
import * as HangUpByHelper from "../../helpers/hangUpBy";
import { HangUpBy } from '../../enums/hangUpBy';

export function reportHangUpByHangupCall(flex: typeof Flex, manager: Flex.Manager) {
  if (!isFeatureEnabled()) return;
  
  flex.Actions.addListener('beforeHangupCall', async (payload, abortFunction) => {
    const currentHangUpBy = HangUpByHelper.getHangUpBy()[payload.sid];
    
    const task = Flex.TaskHelper.getTaskByTaskSid(payload.sid);
    
    if (currentHangUpBy == HangUpBy.ExternalWarmTransfer) {
      if (!HangUpByHelper.hasExternalJoined(task)) {
        // No external participant here, so the xfer must've aborted.
        HangUpByHelper.setHangUpBy(payload.sid, HangUpBy.Agent);
      } else {
        // Temporary value that we use to discern between agent completing an external warm transfer
        // versus a customer hanging up on one being attempted.
        // We need this because with external transfers, at the time of wrapup, no participants are joined.
        HangUpByHelper.setHangUpBy(payload.sid, HangUpBy.CompletedExternalWarmTransfer);
      }
      
      return;
    }
    
    if (currentHangUpBy == HangUpBy.WarmTransfer) {
      // Do nothing if there is another joined worker. If no other joined worker, the transfer didn't complete
      // Let's say AgentB hung up or didn't answer, but then we hang up--change it to Agent in this case.
      if (task.outgoingTransferObject && HangUpByHelper.hasAnotherWorkerJoined(task)) {
        return;
      }
    } else if (task.incomingTransferObject && HangUpByHelper.hasAnotherWorkerJoined(task)) {
      // If this is an incoming xfer and there is another worker in the "joined" state,
      // this worker is aborting the consult
      HangUpByHelper.setHangUpBy(payload.sid, HangUpBy.Consult);
      return;
    }
    
    HangUpByHelper.setHangUpBy(payload.sid, HangUpBy.Agent);
  });
}
