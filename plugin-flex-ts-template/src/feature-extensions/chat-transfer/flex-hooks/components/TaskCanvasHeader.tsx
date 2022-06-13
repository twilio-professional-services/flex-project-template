import * as Flex from '@twilio/flex-ui';
import ChatTransferButton from '../../custom-components/ChatTransferButton'


export function addTransferButtonToChatTaskView(flex: typeof Flex, manager: Flex.Manager) {
  Flex.TaskCanvasHeader.Content.add(<ChatTransferButton key="chat-transfer-button" />, {
    sortOrder: 1,
    if: (props) => props.channelDefinition.capabilities.has('Chat') && props.task.taskStatus === 'assigned',
  });
}
