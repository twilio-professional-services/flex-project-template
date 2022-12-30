import * as Flex from "@twilio/flex-ui";
import { isFeatureEnabled } from '../..';

export function beforeCompleteVideoEscalatedChatTask(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!isFeatureEnabled()) return;

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
