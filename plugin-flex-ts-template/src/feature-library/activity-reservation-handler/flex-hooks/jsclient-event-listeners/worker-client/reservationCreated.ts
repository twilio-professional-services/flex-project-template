import * as Flex from '@twilio/flex-ui';
import { handleReservationCreated } from 'feature-library/activity-reservation-handler/utils/WorkerActivities';
import { Reservation } from '../../../../../types/task-router';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  (manager.workerClient as any).on('reservationCreated', (reservation: Reservation) => {
    //autoAcceptVoiceTask(flex, manager, reservation);
    handleReservationCreated(reservation);
  });
};
