import * as Flex from '@twilio/flex-ui';
import { interceptTransferredChatTasks } from '../../feature-library/chat-transfer/flex-hooks/actions/CompleteTask';
import { beforeCompleteWorkerTask } from '../../feature-library/activity-reservation-handler/flex-hooks/actions/CompleteTask';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  beforeCompleteTask(flex, manager);
  //replaceCompleteTask(flex, manager);
  //afterCompleteTask(flex, manager);
};

function beforeCompleteTask(flex: typeof Flex, manager: Flex.Manager) {
  interceptTransferredChatTasks(flex, manager);
  beforeCompleteWorkerTask(flex, manager);
}

// Avoid using replace hook if possible
function replaceCompleteTask(flex: typeof Flex, manager: Flex.Manager) {}

function afterCompleteTask(flex: typeof Flex, manager: Flex.Manager) {}
