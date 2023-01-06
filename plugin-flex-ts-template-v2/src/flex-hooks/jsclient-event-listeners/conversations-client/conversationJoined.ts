import * as Flex from "@twilio/flex-ui";

import { announceOnChannelWhenJoined } from '../../../feature-library/chat-transfer/flex-hooks/jsclient-event-listeners/conversations-client/conversationJoined';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.conversationsClient.on(
    "conversationJoined",
    (conversation) => {
      announceOnChannelWhenJoined(flex, manager, conversation);
    }
  );
};