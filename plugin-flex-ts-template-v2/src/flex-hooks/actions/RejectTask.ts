import * as Flex from '@twilio/flex-ui';
import { handleInternalRejectTask } from '../../feature-library/internal-call/flex-hooks/actions/RejectTask';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  beforeRejectTask(flex, manager);
  //replaceRejectTask(flex, manager);
  //afterRejectTask(flex, manager);
}

function beforeRejectTask(flex: typeof Flex, manager: Flex.Manager) {
  handleInternalRejectTask(flex, manager);
}

// Avoid using replace hook if possible
function replaceRejectTask(flex: typeof Flex, manager: Flex.Manager) {
}

function afterRejectTask(flex: typeof Flex, manager: Flex.Manager) {
}

