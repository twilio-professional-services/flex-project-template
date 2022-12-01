import * as Flex from "@twilio/flex-ui";
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.chat_to_video_escalation || {};

export function beforeCompleteVideoEscalatedChatTask(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!enabled) return;

  flex.Actions.addListener(
    "beforeCompleteTask",
    async (payload, abortFunction) => {
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
