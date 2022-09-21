import * as Flex from "@twilio/flex-ui";
import channelsToRegister from "./channels";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  channelsToRegister.forEach((channelToRegister) =>
    channelToRegister(flex, manager)
  );
};
