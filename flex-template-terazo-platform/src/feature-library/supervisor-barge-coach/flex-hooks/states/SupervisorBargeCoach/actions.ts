import { Action } from '../../../../../types/manager';
import { ACTION_SET_BARGE_COACH_STATUS } from './types';

class Actions {
  public static setBargeCoachStatus = (status: object): Action => {
    return {
      type: ACTION_SET_BARGE_COACH_STATUS,
      ...status,
    };
  };
}

export default Actions;
