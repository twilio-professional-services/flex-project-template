import * as Flex from "@twilio/flex-ui";
import WorkerActivity from "../../helpers/workerActivityHelper";
import { storeCurrentActivitySidIfNeeded } from "../../helpers/pendingActivity";
import {
  onTaskActivity,
  onTaskNoAcdActivity,
} from "../../helpers/systemActivities";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { isFeatureEnabled } from '../..';

const taskAcceptedHandler = (task: Flex.ITask, flexEvent: FlexEvent) => {
  if (!isFeatureEnabled()) return;

  console.log(`activity-handler: handle ${flexEvent} for ${task.sid}`);

  storeCurrentActivitySidIfNeeded();

  const targetActivity = WorkerActivity.activity?.available
    ? onTaskActivity
    : onTaskNoAcdActivity;

  WorkerActivity.setWorkerActivity(targetActivity?.sid);
};

export default taskAcceptedHandler;
