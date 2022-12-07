import * as Flex from "@twilio/flex-ui";
import { Reservation } from "../../../types/task-router";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  (manager.workerClient as any).on(
    "reservationCreated",
    (reservation: Reservation) => {

    }
  );
};
