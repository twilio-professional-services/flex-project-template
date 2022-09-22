import * as Flex from "@twilio/flex-ui";
import notificationsToRegister from "./notifications";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  notificationsToRegister.forEach((notificationToRegister) => {
    notificationToRegister(flex, manager);
  });
};
