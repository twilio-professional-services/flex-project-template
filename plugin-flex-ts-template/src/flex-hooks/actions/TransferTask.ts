import * as Flex from '@twilio/flex-ui';
import { interceptTransferOverrideForChatTasks } from '../../feature-library/chat-transfer/flex-hooks/actions/TransferTask'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  beforeTransferTask(flex, manager);
  //replaceTransferTask(flex, manager);
  //afterTransferTask(flex, manager);
}

function beforeTransferTask(flex: typeof Flex, manager: Flex.Manager) {
  interceptTransferOverrideForChatTasks(flex, manager);
}

// Avoid using replace hook if possible
function replaceTransferTask(flex: typeof Flex, manager: Flex.Manager) {
}

function afterTransferTask(flex: typeof Flex, manager: Flex.Manager) {
}
