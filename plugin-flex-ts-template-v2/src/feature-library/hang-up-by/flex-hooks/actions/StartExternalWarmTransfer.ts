import * as Flex from "@twilio/flex-ui";
import { isFeatureEnabled } from "../..";
import * as HangUpByHelper from "../../helpers/hangUpBy";
import { HangUpBy } from '../../enums/hangUpBy';

export function reportHangUpByStartExternalWarmTransfer(flex: typeof Flex, manager: Flex.Manager) {
  if (!isFeatureEnabled()) return;
  
  flex.Actions.addListener('beforeStartExternalWarmTransfer', async (payload, abortFunction) => {
    let { task, sid, phoneNumber } = payload;
    
    let newHangUpBy = HangUpBy.ExternalWarmTransfer;
    
    if (!task) {
      task = Flex.TaskHelper.getTaskByTaskSid(sid);
    }
    
    HangUpByHelper.setHangUpBy(task.sid, newHangUpBy);
    await HangUpByHelper.setHangUpByAttribute(task.taskSid, task.attributes, newHangUpBy, phoneNumber);
  });
}
