import * as Flex from "@twilio/flex-ui";
import ActivityReservationHandler from "../../feature-library/activity-reservation-handler/flex-hooks/notifications/ActivityReservationHandler";
import Conference from "../../feature-library/conference/flex-hooks/notifications/Conference";
import ChatTransfer from "../../feature-library/chat-transfer/flex-hooks/notifications/TransferResult";

const notificationsToRegister: ((
  flex: typeof Flex,
  manager: Flex.Manager
) => void)[] = [ActivityReservationHandler, Conference, ChatTransfer];

export default notificationsToRegister;
