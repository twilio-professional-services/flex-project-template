import * as Flex from '@twilio/flex-ui';
import TransferButton from '../../custom-components/TransferButton'

import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled } = custom_data.features.chat_transfer;


export function addTransferButtonToChatTaskView(flex: typeof Flex, manager: Flex.Manager) {

  if(!enabled) return;
  
  Flex.TaskCanvasHeader.Content.add(<TransferButton key="chat-transfer-button" />, {
    sortOrder: 1,
    if: (props) => Flex.TaskHelper.isChatBasedTask(props.task) && !Flex.TaskHelper.isCBMTask(props.task) && props.task.taskStatus === 'assigned',
  });
}
