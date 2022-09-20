import * as Flex from '@twilio/flex-ui';
import { handleHoldConferenceParticipant } from "../../feature-library/conference/flex-hooks/actions/HoldParticipant";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  beforeHoldParticipant(flex, manager);
  //replaceHoldParticipant(flex, manager);
  //afterHoldParticipant(flex, manager);
}

function beforeHoldParticipant(flex: typeof Flex, manager: Flex.Manager) {
  handleHoldConferenceParticipant(flex, manager);
}

// Avoid using replace hook if possible
function replaceHoldParticipant(flex: typeof Flex, manager: Flex.Manager) {
}

function afterHoldParticipant(flex: typeof Flex, manager: Flex.Manager) {
}
