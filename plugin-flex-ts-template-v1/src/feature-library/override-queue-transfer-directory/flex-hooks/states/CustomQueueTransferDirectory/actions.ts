import { Action } from '../../../../../flex-hooks/states'
import { UPDATE_QUEUES_LIST } from './types';


// Provide task to "pending" action as payload
// https://github.com/pburtchaell/redux-promise-middleware/blob/main/docs/guides/optimistic-updates.md

class Actions {

  public static updateAvailableQueues = (queuesList: Array<any>): Action => {
    return {
      type: UPDATE_QUEUES_LIST,
      payload: queuesList,
    }
  };
};



export default Actions;
