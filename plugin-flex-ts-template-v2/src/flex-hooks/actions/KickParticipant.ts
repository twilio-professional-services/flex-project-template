import * as Flex from '@twilio/flex-ui';
import { handleKickConferenceParticipant } from "../../feature-library/conference/flex-hooks/actions/KickParticipant";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  beforeKickParticipant(flex, manager);
  //replaceKickParticipant(flex, manager);
  //afterKickParticipant(flex, manager);
}

function beforeKickParticipant(flex: typeof Flex, manager: Flex.Manager) {
  handleKickConferenceParticipant(flex, manager);
}

// Avoid using replace hook if possible
function replaceKickParticipant(flex: typeof Flex, manager: Flex.Manager) {
}

function afterKickParticipant(flex: typeof Flex, manager: Flex.Manager) {
}

