import * as Flex from '@twilio/flex-ui';
import { addTransferButtonToChatTaskView } from '../../feature-library/chat-transfer/flex-hooks/components/TaskCanvasHeader'


export default (flex: typeof Flex, manager: Flex.Manager) => {
  addTransferButtonToChatTaskView(flex, manager);
}