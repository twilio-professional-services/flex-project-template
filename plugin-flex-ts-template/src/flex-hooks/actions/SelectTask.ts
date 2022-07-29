import * as Flex from '@twilio/flex-ui';
import { autoSelectCallbackTaskWhenEndingCall } from '../../feature-library/callbacks/flex-hooks/actions/SelectTask'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  beforeSelectTask(flex, manager);
  //replaceSelectTask(flex, manager);
  //afterSelectTask(flex, manager);
}

function beforeSelectTask(flex: typeof Flex, manager: Flex.Manager) {
  autoSelectCallbackTaskWhenEndingCall(flex, manager);
}

// Avoid using replace hook if possible
function replaceSelectTask(flex: typeof Flex, manager: Flex.Manager) {
}

function afterSelectTask(flex: typeof Flex, manager: Flex.Manager) {
}
