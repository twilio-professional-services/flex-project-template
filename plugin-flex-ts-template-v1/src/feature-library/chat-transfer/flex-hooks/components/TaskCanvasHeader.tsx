import * as Flex from '@twilio/flex-ui';
import ChatTransferButton from '../../custom-components/ChatTransferButton'

import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled } = custom_data.features.chat_transfer;


export function addTransferButtonToChatTaskView(flex: typeof Flex, manager: Flex.Manager) {

  if(!enabled) return;
  
  Flex.TaskCanvasHeader.Content.add(<ChatTransferButton key="chat-transfer-button" />, {
    sortOrder: 1,
    if: (props) => props.channelDefinition.capabilities.has('Chat') && props.task.taskStatus === 'assigned',
  });
}
