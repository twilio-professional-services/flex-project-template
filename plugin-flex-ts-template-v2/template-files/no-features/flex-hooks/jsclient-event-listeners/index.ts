import * as Flex from "@twilio/flex-ui";
import workerClient from "./worker-client";
import voiceClient from "./voice-client";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  workerClient(flex, manager);
  voiceClient(flex, manager);
};
