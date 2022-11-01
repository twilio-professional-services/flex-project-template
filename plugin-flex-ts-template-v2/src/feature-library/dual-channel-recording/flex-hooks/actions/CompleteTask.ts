import * as Flex from "@twilio/flex-ui";
import { addMissingCallDataIfNeeded } from "../../helpers/dualChannelHelper";
import { UIAttributes } from "../../../../types/manager/ServiceConfiguration";

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration
  .ui_attributes as UIAttributes;
const { enabled = false } =
  custom_data?.features.dual_channel_recording || {};

export function handleDualChannelCompleteTask(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!enabled) return;

  flex.Actions.addListener("beforeCompleteTask", async (payload: any) => {
    // Listening for this event as a last resort check to ensure call
    // and conference metadata are captured on the task
    addMissingCallDataIfNeeded(payload.task);
  });
}
