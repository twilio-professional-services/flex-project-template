import * as Flex from '@twilio/flex-ui';
import { handleUnholdConferenceParticipant } from "../../feature-library/conference/flex-hooks/actions/UnholdParticipant";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  beforeUnholdParticipant(flex, manager);
  replaceUnholdParticipant(flex, manager);
  afterUnholdParticipant(flex, manager);
}

function beforeUnholdParticipant(flex: typeof Flex, manager: Flex.Manager) {
  handleUnholdConferenceParticipant(flex, manager);
}

// Avoid using replace hook if possible
function replaceUnholdParticipant(flex: typeof Flex, manager: Flex.Manager) {
}

function afterUnholdParticipant(flex: typeof Flex, manager: Flex.Manager) {
}
