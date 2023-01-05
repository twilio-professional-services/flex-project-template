import * as Flex from "@twilio/flex-ui";
import { TaskHelper, Actions } from "@twilio/flex-ui";
import { isColdTransferEnabled } from "../../index";
import { TransferActionPayload } from "../../types/ActionPayloads";

// invoke the custom chatTransferTask action if a cbm task otherwise carry on
export function handleChatTransfer(flex: typeof Flex, manager: Flex.Manager) {
  if (!isColdTransferEnabled()) return;

  Flex.Actions.addListener(
    "beforeTransferTask",
    (payload: TransferActionPayload, abortFunction: any) => {
      if (TaskHelper.isCBMTask(payload.task)) {
        // native action handler would fail for chat task so abort the action
        abortFunction();
        // Execute Chat Transfer Task
        Flex.Actions.invokeAction("ChatTransferTask", payload);
      }
    }
  );
}
