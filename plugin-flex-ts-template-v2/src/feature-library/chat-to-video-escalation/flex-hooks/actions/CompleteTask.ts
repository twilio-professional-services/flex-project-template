import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "types/manager/ServiceConfiguration";

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled = false } =
  custom_data?.features?.chat_to_video_escalation || {};

export function beforeCompleteVideoEscalatedChatTask(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!enabled) return;

  flex.Actions.addListener(
    "beforeCompleteTask",
    async (payload: any, abortFunction: () => void) => {
      const { videoRoom } = payload.task.attributes;

      if (!Flex.TaskHelper.isChatBasedTask(payload.task) || !videoRoom) {
        return payload;
      }

      if (videoRoom === "connected") {
        alert(
          "You are still connected to a video room. Please disconnect before completing the task."
        );
        abortFunction();
      }

      return payload;
    }
  );
}
