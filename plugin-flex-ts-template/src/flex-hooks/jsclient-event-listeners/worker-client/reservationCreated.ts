import * as Flex from '@twilio/flex-ui';
import { Reservation } from '../../../types/task-router';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  (manager.workerClient).on('reservationCreated', (reservation: Reservation) => {
    autoAcceptReservation(flex, manager, reservation);
  });
}

// this function or its equivalent would be required if taskrouter-workflow 
// expressions are not used to ensure multiple reservations across channels 
// are prevented
function autoAcceptReservation(flex: typeof Flex, manager: Flex.Manager, reservation: Reservation) {
  const reservationMap = manager.workerClient.reservations;
  const firstReservation = reservationMap.values().next().value as Reservation;

  // this if statement would be commented in if 
  // we only want tot auto accept chat tasks.
  //if(firstReservation.task.taskChannelUniqueName === 'chat'){
    // check to see if this was the first reservation to come in
    // if it was, TaskRouter assigned this first so its the most
    // important, accept it.
    if(firstReservation.sid === reservation.sid) {
      autoAcceptReservationTask(reservation);
    } 
    // otherwise if the reservation is on the same channel as the first
    // reservation we also want to auto accept
    else if (reservation.task.taskChannelUniqueName == firstReservation.task.taskChannelUniqueName){
      autoAcceptReservationTask(reservation);
    }
    // else do nothing and let auto accept check for open
    // reservations and dismiss them
  //} 
}

// this is a robust form of auto selecting and auto accepting a task
function autoAcceptReservationTask(reservation: Reservation) {
  const { sid, task: { taskChannelUniqueName, transfers, attributes } } = reservation;

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
