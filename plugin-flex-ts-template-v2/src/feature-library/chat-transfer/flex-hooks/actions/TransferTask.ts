import * as Flex from "@twilio/flex-ui";
import { TaskHelper, Actions } from "@twilio/flex-ui";
import { isFeatureEnabled } from "../../index";
import { EventPayload } from "../../types/TransferOptions";

// invoke the custom chatTransferTask action if a cbm task otherwise carry on
export function handleChatTransfer(flex: typeof Flex, manager: Flex.Manager) {
  if (!isFeatureEnabled()) return;

  Flex.Actions.addListener(
    "beforeTransferTask",
    (payload: EventPayload, abortFunction: any) => {
      if (TaskHelper.isCBMTask(payload.task)) {
        // native action handler would fail for chat task so abort the action
        abortFunction();
        // Execute Chat Transfer Task
        Flex.Actions.invokeAction("ChatTransferTask", payload);
      }
    }
  );
}
