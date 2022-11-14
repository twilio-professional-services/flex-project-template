import * as Flex from '@twilio/flex-ui';
import { replaceMessageForNotifications } from '../../feature-library/chat-transfer/flex-hooks/components/MessageListItem'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  replaceMessageForNotifications(flex, manager);
}


