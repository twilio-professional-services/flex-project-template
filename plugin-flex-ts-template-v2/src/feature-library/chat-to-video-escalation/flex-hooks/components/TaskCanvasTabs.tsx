import * as Flex from '@twilio/flex-ui';

import VideoRoom from '../../custom-components/VideoRoom';
import { StringTemplates } from '../strings/ChatToVideo';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.TaskCanvasTabs;
export const componentHook = function addVideoRoomTabToTaskCanvasTabs(flex: typeof Flex, manager: Flex.Manager) {
  flex.TaskCanvasTabs.Content.add(
    <Flex.Tab label={(manager.strings as any)[StringTemplates.VideoRoom]} key="VideoRoom" uniqueName="VideoRoom">
      <VideoRoom />
    </Flex.Tab>,
    {
      sortOrder: 10,
      if: (props: any) => props.task.taskStatus === 'assigned' && props.task.attributes.videoRoom !== undefined,
    },
  );
};
