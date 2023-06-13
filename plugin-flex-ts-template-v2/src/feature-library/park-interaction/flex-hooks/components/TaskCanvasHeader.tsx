import * as Flex from '@twilio/flex-ui';

import ParkButton from '../../custom-components/ParkButton';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.TaskCanvasHeader;
export const componentHook = function addParkButton(flex: typeof Flex, manager: Flex.Manager) {
  flex.TaskCanvasHeader.Content.add(<ParkButton key="park-button" />, {
    sortOrder: 1,
    if: (props) => props.channelDefinition.capabilities.has('Chat') && props.task.taskStatus === 'assigned',
  });
};
