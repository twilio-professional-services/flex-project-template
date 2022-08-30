import * as Flex from "@twilio/flex-ui";
import TaskEvents from "./taskEvents";
import PluginEvents from "./pluginEvents";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  TaskEvents(flex, manager);
  PluginEvents(flex, manager);
};
