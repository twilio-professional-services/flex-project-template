import * as Flex from "@twilio/flex-ui";
import reservationCreated from "./reservationCreated";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  reservationCreated(flex, manager);
};
