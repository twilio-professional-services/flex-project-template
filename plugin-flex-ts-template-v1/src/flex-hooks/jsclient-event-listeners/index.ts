import * as Flex from '@twilio/flex-ui';
import chatClient from './chat-client';
import workerClient from './worker-client';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  workerClient(flex, manager);
  chatClient(flex, manager);
}
