import * as Flex from "@twilio/flex-ui";
import { addMissingCallDataIfNeeded } from "../../helpers/dualChannelHelper";
import { isFeatureEnabled } from '../..';

export function handleDualChannelCompleteTask(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!isFeatureEnabled()) return;

  flex.Actions.addListener("beforeCompleteTask", async (payload) => {
    // Listening for this event as a last resort check to ensure call
    // and conference metadata are captured on the task
    addMissingCallDataIfNeeded(payload.task);
  });
}
