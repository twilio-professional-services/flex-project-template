import * as Flex from "@twilio/flex-ui";
import VideoRoom from "../../custom-components/VideoRoom";
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.chat_to_video_escalation || {};

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
