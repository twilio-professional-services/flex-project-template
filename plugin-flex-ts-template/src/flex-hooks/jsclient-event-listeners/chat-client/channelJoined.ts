import * as Flex from '@twilio/flex-ui';
import { announceOnChannelWhenJoined } from '../../../feature-library/chat-transfer/flex-hooks/jsclient-event-listeners/chat-client/channelJoined'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  announceOnChannelWhenJoined(flex, manager);
}
