import * as Flex from '@twilio/flex-ui';
import Callback from '../../feature-library/callbacks/flex-hooks/notifications/Callback'
import ChatTransfer from '../../feature-library/chat-transfer/flex-hooks/notifications/ChatTransfer'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  Callback(flex, manager);
  ChatTransfer(flex, manager);
}
