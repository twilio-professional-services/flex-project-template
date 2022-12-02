import * as Flex from "@twilio/flex-ui";
import { isFeatureEnabled } from "../..";
import * as HangUpByHelper from "../../helpers/hangUpBy";
import { HangUpBy } from '../../enums/hangUpBy';
import TaskRouterService from "../../../../utils/serverless/TaskRouter/TaskRouterService";

export function reportHangUpByCompleteTask(flex: typeof Flex, manager: Flex.Manager) {
  if (!isFeatureEnabled()) return;
  
  flex.Actions.addListener('beforeCompleteTask', async (payload, abortFunction) => {
    let currentHangUpBy = HangUpByHelper.getHangUpBy()[payload.sid];
    
    if (!currentHangUpBy) {
      currentHangUpBy = HangUpBy.Customer;
      HangUpByHelper.setHangUpBy(payload.sid, currentHangUpBy);
    }
    
    if (currentHangUpBy === HangUpBy.CompletedExternalWarmTransfer) {
      // We shouldn't get here, but added a safety net so this value doesn't get saved.
      currentHangUpBy = HangUpBy.ExternalWarmTransfer;
      HangUpByHelper.setHangUpBy(payload.sid, currentHangUpBy);
    }
    
    let attributes = {
      conversations: {
        hang_up_by: currentHangUpBy
      }
    };
    
    try {
      const task = Flex.TaskHelper.getTaskByTaskSid(payload.sid);
      
      if (task.attributes && !task.attributes.conference) {
        // no conference? no call! this functionality is call-specific, so return.
        return;
      }
      
      await TaskRouterService.updateTaskAttributes(task.taskSid, attributes);
      console.log(`Set conversation attributes for ${task.taskSid}`, attributes);
    } catch (error) {
      console.log(`Failed to set conversation attributes for ${payload.sid}`, error);
    }
  });
}
