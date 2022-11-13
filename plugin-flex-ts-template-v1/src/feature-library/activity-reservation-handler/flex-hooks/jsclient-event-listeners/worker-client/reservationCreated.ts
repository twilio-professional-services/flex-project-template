import * as Flex from '@twilio/flex-ui';
import { handleReservationCreated } from './reservationEventListeners'
import { Reservation } from '../../../../../types/task-router';

const trackReservationEventsForActivityChanges =  (flex: typeof Flex, manager: Flex.Manager) => {
  manager.workerClient.on('reservationCreated', (reservation: Reservation) => {
    handleReservationCreated(reservation);
  });
};

export default trackReservationEventsForActivityChanges;
