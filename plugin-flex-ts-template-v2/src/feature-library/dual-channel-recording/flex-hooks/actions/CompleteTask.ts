import * as Flex from "@twilio/flex-ui";
import { addMissingCallDataIfNeeded } from "../../helpers/dualChannelHelper";
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.dual_channel_recording || {};

export function handleDualChannelCompleteTask(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!enabled) return;

  flex.Actions.addListener("beforeCompleteTask", async (payload) => {
    // Listening for this event as a last resort check to ensure call
    // and conference metadata are captured on the task
    addMissingCallDataIfNeeded(payload.task);
  });
}
