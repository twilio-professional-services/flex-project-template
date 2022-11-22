import * as Flex from "@twilio/flex-ui";
import { addMissingCallDataIfNeeded } from "../../helpers/dualChannelHelper";
import { isFeatureEnabled } from '../..';

export function handleDualChannelHangupCall(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!isFeatureEnabled()) return;

  flex.Actions.addListener("beforeHangupCall", async (payload) => {
    // Listening for this event to at least capture the conference SID
    // if the outbound call is canceled before the called party answers
    addMissingCallDataIfNeeded(payload.task);
  });
}
