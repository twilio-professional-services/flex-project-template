import * as Flex from "@twilio/flex-ui";
import { Reservation } from "../../../types/task-router";
// @ts-ignore
import featureReservationCreated from "../../../feature-library/*/flex-hooks/jsclient-event-listeners/worker-client/reservationCreated.*";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  if (typeof featureReservationCreated === 'undefined') {
    return;
  }
  
  (manager.workerClient as any).on(
    "reservationCreated",
    (reservation: Reservation) => {
      featureReservationCreated.forEach((file: any) => {
        file.default(flex, manager, reservation);
      });
    }
  );
};
