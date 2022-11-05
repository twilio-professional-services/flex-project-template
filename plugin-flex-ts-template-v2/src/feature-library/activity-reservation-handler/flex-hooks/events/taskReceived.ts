import * as Flex from "@twilio/flex-ui";
import { storeCurrentActivitySidIfNeeded } from "../../helpers/pendingActivity";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { UIAttributes } from "types/manager/ServiceConfiguration";

const { custom_data } =
  (Flex.Manager.getInstance().configuration as UIAttributes) || {};
const { enabled = false } =
  custom_data?.features?.activity_reservation_handler || {};

const taskReceivedHandler = (task: Flex.ITask, flexEvent: FlexEvent) => {
  if (!enabled) return;

  console.log(`activity-handler: handle ${flexEvent} for ${task.sid}`);

  storeCurrentActivitySidIfNeeded();
};

export default taskReceivedHandler;
