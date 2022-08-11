import * as Flex from '@twilio/flex-ui';
import { omniChannelChatCapacityManager } from '../../feature-library/omni-channel-capacity-management/flex-hooks/actions/AcceptTask'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  //beforeAcceptTask(flex, manager);
  //replaceAcceptTask(flex, manager);
  afterAcceptTask(flex, manager);
}

function beforeAcceptTask(flex: typeof Flex, manager: Flex.Manager) {
}

// Avoid using replace hook if possible
function replaceAcceptTask(flex: typeof Flex, manager: Flex.Manager) {
}

function afterAcceptTask(flex: typeof Flex, manager: Flex.Manager) {
  omniChannelChatCapacityManager(flex, manager);
}
