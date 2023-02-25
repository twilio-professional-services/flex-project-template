import * as Flex from "@twilio/flex-ui";
import { storeCurrentActivitySidIfNeeded } from "../../helpers/pendingActivity";
import { FlexEvent } from "../../../../types/feature-loader/FlexEvent";

export const eventName = FlexEvent.taskReceived;
export const eventHook = (flex: typeof Flex, manager: Flex.Manager, task: Flex.ITask) => {
  console.log(`activity-handler: handle ${eventName} for ${task.sid}`);

  storeCurrentActivitySidIfNeeded();
};
