import * as Flex from '@twilio/flex-ui';

import VideoRoom from '../../custom-components/VideoRoom';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.TaskCanvasTabs;
export const componentHook = function addVideoRoomTabToTaskCanvasTabs(flex: typeof Flex) {
  flex.TaskCanvasTabs.Content.add(
    <Flex.Tab label="Video Room" key="VideoRoom" uniqueName="VideoRoom">
      <VideoRoom />
    </Flex.Tab>,
    {
      sortOrder: 10,
      if: (props: any) => props.task.attributes.videoRoom !== undefined,
    },
  );
};
