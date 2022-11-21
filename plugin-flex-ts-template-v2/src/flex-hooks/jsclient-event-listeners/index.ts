import * as Flex from "@twilio/flex-ui";
import conversationsClient from "./conversations-client";
import workerClient from "./worker-client";
import voiceClient from "./voice-client";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  conversationsClient(flex, manager);
  workerClient(flex, manager);
  voiceClient(flex, manager);
};
