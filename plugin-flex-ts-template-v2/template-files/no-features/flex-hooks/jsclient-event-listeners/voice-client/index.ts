import * as Flex from "@twilio/flex-ui";
import incoming from "./incoming";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  incoming(flex, manager);
};
