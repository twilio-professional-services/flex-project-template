import * as Flex from "@twilio/flex-ui";
import { TaskHelper, Actions } from "@twilio/flex-ui";
import { isFeatureEnabled } from "../../index";
import { EventPayload } from "../../types/TransferOptions";

// invoke the custom chatTransferTask action if a cbm task otherwise carry on
export function handleChatTransfer(flex: typeof Flex, manager: Flex.Manager) {
  if (!isFeatureEnabled()) return;

  Actions.replaceAction(
    "TransferTask",
    (payload: EventPayload, original: any) => {
      if (!TaskHelper.isCBMTask(payload.task)) {
        return original(payload);
      }

      //invoke new action
      return Actions.invokeAction("ChatTransferTask", payload);
    }
  );
}
