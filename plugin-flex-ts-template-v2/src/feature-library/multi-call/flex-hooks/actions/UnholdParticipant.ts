import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "types/manager/ServiceConfiguration";
import { holdOtherCalls } from '../../helpers/MultiCallHelper';

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled = false } = custom_data?.features.multi_call || {};

export function handleMultiCallUnholdParticipant(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;
  
  flex.Actions.addListener('beforeUnholdParticipant', async (payload: any, abortFunction: () => void) => {
    let callSid = "";
    
    if (payload.targetSid) {
      callSid = payload.targetSid;
    } else if (payload.participant) {
      callSid = payload.participant.callSid;
    } else {
      let task;
      
      if (payload.sid) {
        task = Flex.TaskHelper.getTaskByTaskSid(payload.sid);
      } else {
        task = payload.task;
      }
      
      if (task && task.conference && task.conference.participants) {
        // Make sure we don't hold the call we just accepted.
        task.conference.participants.forEach((p: Flex.ConferenceParticipant) => {
          // Find our worker in the list of participants to get the call SID.
          if (p.isCurrentWorker && p.callSid) {
            callSid = p.callSid;
          }
        });
      }
    }
    
    holdOtherCalls(callSid);
  });
}
