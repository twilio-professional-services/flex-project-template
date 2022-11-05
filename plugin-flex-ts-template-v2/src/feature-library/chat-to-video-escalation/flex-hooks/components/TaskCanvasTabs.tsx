import * as Flex from "@twilio/flex-ui";
import VideoRoom from "../../custom-components/VideoRoom";

import { UIAttributes } from "types/manager/ServiceConfiguration";

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled = false } = custom_data?.features?.chat_to_video_escalation || {};

export function addVideoRoomTabToTaskCanvasTabs(flex: typeof Flex) {
  if (!enabled) return;

  flex.TaskCanvasTabs.Content.add(
    <Flex.Tab label="Video Room" key="VideoRoom">
      <VideoRoom />
    </Flex.Tab>,
    {
      sortOrder: 10,
      if: (props: any) => props.task.attributes.videoRoom !== undefined,
    }
  );
}
