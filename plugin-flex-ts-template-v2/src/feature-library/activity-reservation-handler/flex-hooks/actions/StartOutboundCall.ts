import * as Flex from "@twilio/flex-ui";
import WorkerState from "../../helpers/workerActivityHelper";
import { UIAttributes } from "types/manager/ServiceConfiguration";
import { storeCurrentActivitySidIfNeeded } from "../../helpers/pendingActivity";
import {
  onTaskActivity,
  onTaskNoAcdActivity,
} from "../../helpers/systemActivities";

const { custom_data } =
  (Flex.Manager.getInstance().configuration as UIAttributes) || {};
const { enabled = false } =
  custom_data?.features?.activity_reservation_handler || {};

export function changeWorkerActivityBeforeOutboundCall(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!enabled) return;

  flex.Actions.addListener(
    "beforeStartOutboundCall",
    async (payload: any, abortFunction: any) => {
      storeCurrentActivitySidIfNeeded();

      const targetActivity = WorkerState.activity?.available
        ? onTaskActivity
        : onTaskNoAcdActivity;

      WorkerState.setWorkerActivity(targetActivity?.sid);
      await WorkerState.waitForWorkerActivityChange(targetActivity?.sid);
    }
  );
}
