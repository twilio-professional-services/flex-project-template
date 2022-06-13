import * as Flex from '@twilio/flex-ui';
import channelJoined from './channelJoined'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  channelJoined(flex, manager);
}
