import * as Flex from "@twilio/flex-ui";
import { addVideoRoomTabToTaskCanvasTabs } from "../../feature-library/chat-to-video-escalation/flex-hooks/components/TaskCanvasTabs";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  addVideoRoomTabToTaskCanvasTabs(flex);
};
