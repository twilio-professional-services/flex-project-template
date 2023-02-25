import * as Flex from "@twilio/flex-ui";
import { addMissingCallDataIfNeeded } from "../../helpers/dualChannelHelper";
import { FlexActionEvent, FlexAction } from "../../../../types/feature-loader/FlexAction";

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.CompleteTask;
export const actionHook = function handleDualChannelCompleteTask(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  flex.Actions.addListener("beforeCompleteTask", async (payload) => {
    // Listening for this event as a last resort check to ensure call
    // and conference metadata are captured on the task
    addMissingCallDataIfNeeded(payload.task);
  });
}
