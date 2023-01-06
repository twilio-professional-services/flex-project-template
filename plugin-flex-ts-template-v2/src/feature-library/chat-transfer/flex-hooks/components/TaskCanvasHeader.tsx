import * as Flex from '@twilio/flex-ui';
import TransferButton from '../../custom-components/TransferButton';
import { isFeatureEnabled } from '../../index';

export function addTransferButtonToChatTaskView(flex: typeof Flex, manager: Flex.Manager) {

  if(!isFeatureEnabled()) return;
  
  Flex.TaskCanvasHeader.Content.add(<TransferButton key="chat-transfer-button" />, {
    sortOrder: 1,
    if: (props) => Flex.TaskHelper.isChatBasedTask(props.task) && !Flex.TaskHelper.isCBMTask(props.task) && props.task.taskStatus === 'assigned',
  });
}
