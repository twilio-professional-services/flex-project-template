import * as Flex from '@twilio/flex-ui';

import TransferButton from '../../custom-components/TransferButton';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.TaskCanvasHeader;
export const componentHook = function addTransferButtonToChatTaskView(flex: typeof Flex, _manager: Flex.Manager) {
  flex.TaskCanvasHeader.Content.add(<TransferButton key="chat-transfer-button" />, {
    sortOrder: 1,
    if: (props) =>
      Flex.TaskHelper.isChatBasedTask(props.task) &&
      !Flex.TaskHelper.isCBMTask(props.task) &&
      props.task.taskStatus === 'assigned',
  });
};
