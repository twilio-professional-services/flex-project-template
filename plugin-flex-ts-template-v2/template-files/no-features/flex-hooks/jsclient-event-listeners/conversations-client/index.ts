import * as Flex from "@twilio/flex-ui";
import conversationJoined from "./conversationJoined";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  conversationJoined(flex, manager);
};
