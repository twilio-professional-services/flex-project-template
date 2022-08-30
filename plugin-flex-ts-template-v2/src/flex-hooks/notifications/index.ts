import * as Flex from "@twilio/flex-ui";
import ActivityReservationHandler from "../../feature-library/activity-reservation-handler/flex-hooks/notifications/ActivityReservationHandler";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  ActivityReservationHandler(flex, manager);
};
