import * as Flex from "@twilio/flex-ui";
import WorkerState from "../../helpers/workerActivityHelper";
import { getPendingActivity } from "../../helpers/pendingActivity";

import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.activity_reservation_handler || {};

export function beforeCompleteWorkerTask(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!enabled) return;

  flex.Actions.addListener("beforeCompleteTask", async () => {
    const pendingActivity = getPendingActivity();

    if (pendingActivity) {
      console.debug(
        "beforeCompleteTask, Setting worker to pending activity",
        pendingActivity.name
      );
      WorkerState.setWorkerActivity(pendingActivity.sid, true);
      await WorkerState.waitForWorkerActivityChange(pendingActivity.sid);
    }
  });
}
