import * as Flex from "@twilio/flex-ui";
import { addMissingCallDataIfNeeded } from "../../helpers/dualChannelHelper";
import { UIAttributes } from "../../../../types/manager/ServiceConfiguration";

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration
  .ui_attributes as UIAttributes;
const { enabled = false } =
  custom_data?.features.dual_channel_recording || {};

export function handleDualChannelHangupCall(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!enabled) return;

  flex.Actions.addListener("beforeHangupCall", async (payload: any) => {
    // Listening for this event to at least capture the conference SID
    // if the outbound call is canceled before the called party answers
    addMissingCallDataIfNeeded(payload.task);
  });
}
