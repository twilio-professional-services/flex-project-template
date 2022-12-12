import * as Flex from "@twilio/flex-ui";
import VideoRoom from "../../custom-components/VideoRoom";
import { isFeatureEnabled } from '../..';

export function addVideoRoomTabToTaskCanvasTabs(flex: typeof Flex) {
  if (!isFeatureEnabled()) return;

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
