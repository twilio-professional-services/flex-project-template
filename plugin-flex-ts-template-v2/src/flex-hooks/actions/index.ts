import * as Flex from "@twilio/flex-ui";
import actionsToRegister from "./actions";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  for (const [actionName, actionEvents] of Object.entries(actionsToRegister)) {
    for (const [actionEvent, methodsToCalls] of Object.entries(actionEvents)) {
      methodsToCalls.forEach((methodToCall) => methodToCall(flex, manager));
    }
  }
};
