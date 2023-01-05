import * as Flex from "@twilio/flex-ui";
import { isColdTransferEnabled, isMultiParticipantEnabled } from "../../index";

export function handleChatTransferShowDirectory(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (isMultiParticipantEnabled()) return;

  Flex.Actions.addListener(
    "beforeShowDirectory",
    (payload: any, abortFunction: any) => {
      let display = "flex";
      const taskSid = manager.store.getState().flex.view.selectedTaskSid;

      if (!taskSid) return;

      // Hide consult transfer for CBM tasks only
      if (
        Flex.TaskHelper.isCBMTask(Flex.TaskHelper.getTaskByTaskSid(taskSid))
      ) {
        display = "none";
      }

      manager.updateConfig({
        theme: {
          componentThemeOverrides: {
            WorkerDirectory: {
              Container: {
                ".Twilio-WorkerDirectory-ButtonContainer": {
                  "&>:nth-child(1)": {
                    display,
                  },
                },
              },
            },
          },
        },
      });
    }
  );
}
