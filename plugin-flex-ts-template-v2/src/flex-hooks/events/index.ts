import * as Flex from "@twilio/flex-ui";
import TaskEvents from "./task";
import PluginEvents from "./plugin";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  TaskEvents(flex, manager);
  PluginEvents(flex, manager);
};
