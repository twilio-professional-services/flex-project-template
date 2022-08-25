import * as Flex from "@twilio/flex-ui";
import { storeCurrentActivitySidIfNeeded } from "../../helpers/pendingActivity";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
const taskReceivedHandler = (task: Flex.ITask, flexEvent: FlexEvent) => {
  console.log(`activity-handler: handle ${flexEvent} for ${task.sid}`);

  storeCurrentActivitySidIfNeeded();
};

export default taskReceivedHandler;
