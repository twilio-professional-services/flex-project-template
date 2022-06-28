import * as Flex from '@twilio/flex-ui';
import { Reservation } from '../../../types/task-router';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  (manager.workerClient).on('reservationCreated', (reservation: Reservation) => {
    //autoAcceptVoiceTask(flex, manager, reservation);
  });
}

function autoAcceptVoiceTask(flex: typeof Flex, manager: Flex.Manager, reservation: Reservation) {
  const { sid, task: { taskChannelUniqueName, transfers, attributes } } = reservation;

  if (taskChannelUniqueName === 'voice') {

    // Auto select the voice task
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
}
