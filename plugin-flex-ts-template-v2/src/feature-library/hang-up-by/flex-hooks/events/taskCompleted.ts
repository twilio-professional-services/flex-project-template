import * as Flex from "@twilio/flex-ui";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { isFeatureEnabled } from "../..";
import * as HangUpByHelper from "../../helpers/hangUpBy";
import { HangUpBy } from '../../enums/hangUpBy';

const taskCompletedHandler = async (task: Flex.ITask, flexEvent: FlexEvent) => {
  if (!isFeatureEnabled()) return;
  
  let currentHangUpBy = HangUpByHelper.getHangUpBy()[task.sid];
  
  if (currentHangUpBy === HangUpBy.ColdTransfer || currentHangUpBy === HangUpBy.WarmTransfer) {
    // reset task attribute to Customer, as the task lives on after this transfer
    // Insights has grabbed the [Cold/Warm]Transfer value already at this point
    
    // Double-check that the customer is still here
    if (await HangUpByHelper.hasAnotherNonWorkerJoined(task)) {
      currentHangUpBy = HangUpBy.Customer;
      await HangUpByHelper.setHangUpByAttribute(task.taskSid, task.attributes, currentHangUpBy);
    }
  }
  
  // prevent ballooning of storage
  HangUpByHelper.clearHangUpBy(task.sid);
};

export default taskCompletedHandler;
