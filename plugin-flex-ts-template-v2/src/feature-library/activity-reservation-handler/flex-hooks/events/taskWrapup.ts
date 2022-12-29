import * as Flex from "@twilio/flex-ui";
import FlexHelper from "../../helpers/flexHelper";
import WorkerActivity from "../../helpers/workerActivityHelper";
import {
  SystemActivityNames,
  wrapupActivity,
  wrapupNoAcdActivity,
} from "../../helpers/systemActivities";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { isFeatureEnabled } from '../..';

const taskEndedHandler = (task: Flex.ITask, flexEvent: FlexEvent) => {
  if (!isFeatureEnabled()) return;

  console.log(`activity-handler: handle ${flexEvent} for ${task.sid}`);

  if (
    FlexHelper.hasLiveCallTask ||
    FlexHelper.hasPendingTask ||
    WorkerActivity.activityName === SystemActivityNames.wrapup
  ) {
    return;
  }

  const targetActivity = WorkerActivity.activity?.available
    ? wrapupActivity
    : wrapupNoAcdActivity;

  WorkerActivity.setWorkerActivity(targetActivity?.sid);
};

export default taskEndedHandler;
