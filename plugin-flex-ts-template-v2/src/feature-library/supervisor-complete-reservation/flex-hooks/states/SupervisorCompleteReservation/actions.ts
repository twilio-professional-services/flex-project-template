import { Action } from '../../../../../types/manager';
import SupervisorCompleteReservationService from '../../../utils/SupervisorCompleteReservation';
import { UPDATE_RERSERVATION } from './types';

// Provide task to "pending" action as payload
// https://github.com/pburtchaell/redux-promise-middleware/blob/main/docs/guides/optimistic-updates.md

class Actions {
  public static updateReservation = (taskSid: string, reservationSid: string, status: string): Action => {
    return {
      type: UPDATE_RERSERVATION,
      payload: {
        promise: SupervisorCompleteReservationService.updateReservation(taskSid, reservationSid, status),
        data: { taskSid },
      },
    };
  };
}

export default Actions;
