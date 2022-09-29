import * as Flex from '@twilio/flex-ui';
import { handleInternalAcceptTask } from '../../feature-library/internal-call/flex-hooks/actions/AcceptTask';
import { omniChannelChatCapacityManager } from '../../feature-library/omni-channel-capacity-management/flex-hooks/actions/AcceptTask';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  beforeAcceptTask(flex, manager);
  //replaceAcceptTask(flex, manager);
  afterAcceptTask(flex, manager);
}

function beforeAcceptTask(flex: typeof Flex, manager: Flex.Manager) {
  handleInternalAcceptTask(flex, manager);
}

// Avoid using replace hook if possible
function replaceAcceptTask(flex: typeof Flex, manager: Flex.Manager) {
}

function afterAcceptTask(flex: typeof Flex, manager: Flex.Manager) {
  omniChannelChatCapacityManager(flex, manager);
}
