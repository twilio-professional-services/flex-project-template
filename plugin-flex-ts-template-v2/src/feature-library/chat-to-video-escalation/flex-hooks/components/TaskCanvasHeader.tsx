import * as Flex from '@twilio/flex-ui';

import SwitchToVideo from '../../custom-components/SwitchToVideo';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.TaskCanvasHeader;
export const componentHook = function addSwitchToVideoToTaskCanvasHeader(flex: typeof Flex) {
  flex.TaskCanvasHeader.Content.add(<SwitchToVideo key="switch-to-video" />, {
    sortOrder: 1,
    if: (props: any) => flex.TaskHelper.isChatBasedTask(props.task) && props.task.taskStatus === 'assigned',
  });
};
