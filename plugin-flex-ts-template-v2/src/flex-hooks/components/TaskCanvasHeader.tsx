import * as Flex from "@twilio/flex-ui";
import { addSwitchToVideoToTaskCanvasHeader } from "../../feature-library/chat-to-video-escalation/flex-hooks/components/TaskCanvasHeader";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  addSwitchToVideoToTaskCanvasHeader(flex);
};
