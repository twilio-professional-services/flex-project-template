import * as Flex from "@twilio/flex-ui";
import { isFeatureEnabled } from "../../index";
import { EventPayload } from "../../types/TransferOptions";

export function handleChatTransferShowDirectory(flex: typeof Flex, manager: Flex.Manager) {
  if (!isFeatureEnabled()) return;

  Flex.Actions.addListener(
    "beforeShowDirectory",
    (payload: EventPayload, abortFunction: any) => {
      let display = "flex";
      const taskSid = manager.store.getState().flex.view.selectedTaskSid;
      
      if (!taskSid) return;
      
      // Hide consult transfer for CBM tasks only
      if (Flex.TaskHelper.isCBMTask(Flex.TaskHelper.getTaskByTaskSid(taskSid))) {
        display = "none";
      }
      
      manager.updateConfig({
        theme: {
          componentThemeOverrides: {
            WorkerDirectory: {
              Container: {
                ".Twilio-WorkerDirectory-ButtonContainer": {
                  "&>:nth-child(1)": {
                    display
                  }
                }
              }
            }
          },
        },
      });
      
    }
  );
}
