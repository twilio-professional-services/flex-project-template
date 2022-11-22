import * as Flex from "@twilio/flex-ui";
import { storeCurrentActivitySidIfNeeded } from "../../helpers/pendingActivity";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { isFeatureEnabled } from '../..';

const taskReceivedHandler = (task: Flex.ITask, flexEvent: FlexEvent) => {
  if (!isFeatureEnabled()) return;

  console.log(`activity-handler: handle ${flexEvent} for ${task.sid}`);

  storeCurrentActivitySidIfNeeded();
};

export default taskReceivedHandler;
