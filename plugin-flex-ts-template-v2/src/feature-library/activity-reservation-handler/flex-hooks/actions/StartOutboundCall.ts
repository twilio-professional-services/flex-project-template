import * as Flex from "@twilio/flex-ui";
import WorkerState from "../../helpers/workerActivityHelper";
import { storeCurrentActivitySidIfNeeded } from "../../helpers/pendingActivity";
import {
  onTaskActivity,
  onTaskNoAcdActivity,
} from "../../helpers/systemActivities";
import { FlexActionEvent, FlexAction } from "../../../../types/feature-loader/FlexAction";

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.StartOutboundCall;
export const actionHook = function changeWorkerActivityBeforeOutboundCall(
  flex: typeof Flex,
  manager: Flex.Manager
) {
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
