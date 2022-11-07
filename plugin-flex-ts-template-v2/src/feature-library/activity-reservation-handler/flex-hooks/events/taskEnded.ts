import * as Flex from "@twilio/flex-ui";
import FlexHelper from "../../helpers/flexHelper";
import WorkerActivity from "../../helpers/workerActivityHelper";
import {
  systemActivities,
  availableActivity,
} from "../../helpers/systemActivities";
import { getPendingActivity } from "../../helpers/pendingActivity";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { UIAttributes } from "types/manager/ServiceConfiguration";

const { custom_data } =
  (Flex.Manager.getInstance().configuration as UIAttributes) || {};
const { enabled = false } =
  custom_data?.features?.activity_reservation_handler || {};

const taskEndedHandler = (task: Flex.ITask, flexEvent: FlexEvent) => {
  if (!enabled) return;

  console.log(`activity-handler: handle ${flexEvent} for ${task.sid}`);

  const pendingActivity = getPendingActivity();

  if (
    flexEvent === FlexEvent.taskTimeout ||
    FlexHelper.hasActiveCallTask ||
    FlexHelper.hasWrappingTask ||
    WorkerActivity.activitySid === pendingActivity?.sid
  ) {
    return;
  }

  if (pendingActivity) {
    console.debug(
      "handleReservationEnded, Setting worker to pending activity",
      pendingActivity.name
    );
    WorkerActivity.setWorkerActivity(pendingActivity.sid, true);
  } else if (
    systemActivities
      .map((a) => a.toLowerCase())
      .includes((WorkerActivity.activityName as string).toLowerCase())
  ) {
    console.debug(
      "handleReservationEnded, No pending activity and current activity " +
        `"${WorkerActivity.activityName}" is a system activity. Setting worker to ` +
        "default activity:",
      availableActivity?.name
    );
    WorkerActivity.setWorkerActivity(availableActivity?.sid);
  }
};

export default taskEndedHandler;
