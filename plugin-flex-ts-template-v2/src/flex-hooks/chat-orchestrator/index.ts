import * as Flex from "@twilio/flex-ui";

import ProgrammableChatTransfer from '../../feature-library/chat-transfer/flex-hooks/chat-orchestrator';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  ProgrammableChatTransfer(flex, manager);
}

