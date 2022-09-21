import * as Flex from "@twilio/flex-ui";
import components from "./components";
export default (flex: typeof Flex, manager: Flex.Manager) => {
  for (const [componentName, componentHandlers] of Object.entries(components)) {
    componentHandlers.forEach((componentHandler) =>
      componentHandler(flex, manager)
    );
  }
};
