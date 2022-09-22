import * as Flex from '@twilio/flex-ui';
import { handleInternalHoldCall } from "../../feature-library/internal-call/flex-hooks/actions/HoldCall";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  beforeHoldCall(flex, manager);
  //replaceHoldCall(flex, manager);
  //afterHoldCall(flex, manager);
}

function beforeHoldCall(flex: typeof Flex, manager: Flex.Manager) {
  handleInternalHoldCall(flex, manager);
}

// Avoid using replace hook if possible
function replaceHoldCall(flex: typeof Flex, manager: Flex.Manager) {
}

function afterHoldCall(flex: typeof Flex, manager: Flex.Manager) {
}
