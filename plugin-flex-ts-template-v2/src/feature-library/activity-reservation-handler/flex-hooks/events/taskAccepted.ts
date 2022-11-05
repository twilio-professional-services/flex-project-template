import * as Flex from "@twilio/flex-ui";
import WorkerActivity from "../../helpers/workerActivityHelper";
import { storeCurrentActivitySidIfNeeded } from "../../helpers/pendingActivity";
import {
  onTaskActivity,
  onTaskNoAcdActivity,
} from "../../helpers/systemActivities";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { UIAttributes } from "types/manager/ServiceConfiguration";

const { custom_data } =
  (Flex.Manager.getInstance().configuration as UIAttributes) || {};
const { enabled = false } =
  custom_data?.features?.activity_reservation_handler || {};

const taskAcceptedHandler = (task: Flex.ITask, flexEvent: FlexEvent) => {
  if (!enabled) return;

  console.log(`activity-handler: handle ${flexEvent} for ${task.sid}`);

  storeCurrentActivitySidIfNeeded();

  const targetActivity = WorkerActivity.activity?.available
    ? onTaskActivity
    : onTaskNoAcdActivity;

  WorkerActivity.setWorkerActivity(targetActivity?.sid);
};

export default taskAcceptedHandler;
