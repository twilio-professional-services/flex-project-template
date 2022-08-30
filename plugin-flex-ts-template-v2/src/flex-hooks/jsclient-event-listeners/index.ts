import * as Flex from "@twilio/flex-ui";
import workerClient from "./worker-client";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  workerClient(flex, manager);
};
