import * as Flex from "@twilio/flex-ui";
import ActivityReservationHandler from "../../feature-library/activity-reservation-handler/flex-hooks/notifications/ActivityReservationHandler";
import Conference from "../../feature-library/conference/flex-hooks/notifications/Conference";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  ActivityReservationHandler(flex, manager);
  Conference(flex, manager);
};
