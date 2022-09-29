import * as Flex from '@twilio/flex-ui';
import { handleInternalUnholdCall } from "../../feature-library/internal-call/flex-hooks/actions/UnholdCall";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  beforeUnholdCall(flex, manager);
  //replaceUnholdCall(flex, manager);
  //afterUnholdCall(flex, manager);
}

function beforeUnholdCall(flex: typeof Flex, manager: Flex.Manager) {
  handleInternalUnholdCall(flex, manager);
}

// Avoid using replace hook if possible
function replaceUnholdCall(flex: typeof Flex, manager: Flex.Manager) {
}

function afterUnholdCall(flex: typeof Flex, manager: Flex.Manager) {
}
