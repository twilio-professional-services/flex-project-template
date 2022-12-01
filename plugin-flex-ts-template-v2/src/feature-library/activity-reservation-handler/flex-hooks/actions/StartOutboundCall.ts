import * as Flex from "@twilio/flex-ui";
import WorkerState from "../../helpers/workerActivityHelper";
import { storeCurrentActivitySidIfNeeded } from "../../helpers/pendingActivity";
import {
  onTaskActivity,
  onTaskNoAcdActivity,
} from "../../helpers/systemActivities";

import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.activity_reservation_handler || {};

export function changeWorkerActivityBeforeOutboundCall(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!enabled) return;

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
