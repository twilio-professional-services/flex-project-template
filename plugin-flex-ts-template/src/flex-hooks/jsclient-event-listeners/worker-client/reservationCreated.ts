import * as Flex from '@twilio/flex-ui';
import { Reservation } from '../../../types/task-router';
import trackReservationEventsForActivityChanges from '../../../feature-library/activity-reservation-handler/flex-hooks/jsclient-event-listeners/worker-client/reservationCreated'

export default (flex: typeof Flex, manager: Flex.Manager) => {

  trackReservationEventsForActivityChanges(flex, manager);

  (manager.workerClient).on('reservationCreated', (reservation: Reservation) => {
    //selectAndAcceptReservation(reservation);
  });
}

// this is a robust form of auto selecting and auto accepting a task
function selectAndAcceptReservation(reservation: Reservation) {
  const { sid, task: { transfers, attributes } } = reservation;

    // Auto select the task
    Flex.Actions.invokeAction('SelectTask', { sid });

    if (((transfers.incoming !== undefined && transfers.incoming !== null) || attributes.direction !== 'outbound')) {

      // Attempt to accept the task
      Flex.Actions.invokeAction('AcceptTask', { sid });

      // Creating an interval to check the task has been accepted
      // and retries if it has not.  To avoid a runway process, 
      // applying an attempts counter to ultimately abandon the retry
      // after ten attempts
      let attempts = 0;
      const selectTaskTimer = setInterval(() => {
        const task = Flex.TaskHelper.getTaskByTaskSid(reservation.task.reservationSid)
        if (!task || !task.status) {
          clearInterval(selectTaskTimer);
          attempts = 0;
        }
        else if (Flex.TaskHelper.isTaskAccepted(task)) {
          Flex.Actions.invokeAction('SelectTask', { sid })
          clearInterval(selectTaskTimer);
          attempts = 0;
        }
        else if (attempts > 10) {
          clearInterval(selectTaskTimer);
          attempts = 0;
        }
        else {
          attempts++
        }
      }, 500);
    }
}
