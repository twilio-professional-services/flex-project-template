import * as Flex from "@twilio/flex-ui";
import WorkerState from "../../helpers/workerActivityHelper";
import { getPendingActivity } from "../../helpers/pendingActivity";
import { isFeatureEnabled } from '../..';

export function beforeCompleteWorkerTask(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!isFeatureEnabled()) return;

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
