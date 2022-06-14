import * as Flex from '@twilio/flex-ui';
import ChatTransfer from '../../feature-library/chat-transfer/flex-hooks/notifications/ChatTransfer'
import Callback from '../../feature-library/callbacks/flex-hooks/notifications/Callback'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  ChatTransfer(flex, manager);
  Callback(flex, manager);
}
