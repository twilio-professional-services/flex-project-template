import * as Flex from "@twilio/flex-ui";
// @ts-ignore
import featureConversationJoined from "../../../feature-library/*/flex-hooks/jsclient-event-listeners/conversations-client/conversationJoined.*";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  if (typeof featureConversationJoined === 'undefined') {
    return;
  }
  
  manager.conversationsClient.on(
    "conversationJoined",
    (conversation) => {
      featureConversationJoined.forEach((file: any) => {
        file.default(flex, manager, conversation);
      });
    }
  );
};