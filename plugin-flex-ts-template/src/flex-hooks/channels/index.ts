import * as Flex from '@twilio/flex-ui';
import { createCallbackChannel } from '../../feature-library/callbacks/flex-hooks/channels/Callback'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  createCallbackChannel(flex, manager);
};
