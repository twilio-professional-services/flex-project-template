import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "types/manager/ServiceConfiguration";

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration
  .ui_attributes as UIAttributes;
const { enabled = false } =
  custom_data?.features?.chat_to_video_escalation || {};

export function beforeCompleteVideoEscalatedChatTask(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!enabled) return;

  flex.Actions.addListener(
    "beforeCompleteTask",
    async (payload, cancelActionInvocation) => {
      const { videoRoom } = payload.task.attributes;

      if (!Flex.TaskHelper.isChatBasedTask(payload.task) || !videoRoom) {
        return payload;
      }

      if (videoRoom === "connected") {
        alert(
          "You are still connected to a video room. Please disconnect before completing the task."
        );
        cancelActionInvocation();
      }

      return payload;
    }
  );
}
