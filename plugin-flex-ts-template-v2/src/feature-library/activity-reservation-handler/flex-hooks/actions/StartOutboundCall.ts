import * as Flex from "@twilio/flex-ui";
import WorkerState from "../../helpers/workerActivityHelper";
import { storeCurrentActivitySidIfNeeded } from "../../helpers/pendingActivity";
import {
  onTaskActivity,
  onTaskNoAcdActivity,
} from "../../helpers/systemActivities";
import { isFeatureEnabled } from '../..';

export function changeWorkerActivityBeforeOutboundCall(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!isFeatureEnabled()) return;

  flex.Actions.addListener(
    "beforeStartOutboundCall",
    async (payload, abortFunction) => {
      storeCurrentActivitySidIfNeeded();

      const targetActivity = WorkerState.activity?.available
        ? onTaskActivity
        : onTaskNoAcdActivity;

      WorkerState.setWorkerActivity(targetActivity?.sid);
      await WorkerState.waitForWorkerActivityChange(targetActivity?.sid);
    }
  );
}
