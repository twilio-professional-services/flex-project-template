import * as Flex from "@twilio/flex-ui";
import PluginsLoaded from "./PluginsLoaded";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  PluginsLoaded(manager);
};
