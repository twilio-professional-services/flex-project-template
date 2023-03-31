import { Action } from '../../../../../types/manager';
import { SupervisorBargeCoachState, ACTION_SET_BARGE_COACH_STATUS } from './types';
import initialState from './initialState';

export const reducerHook = () => ({ supervisorBargeCoach: reducer });

// Exporting and adding a reducer for the states we will use later for the buttons
const reducer = function (state = initialState, action: Action): SupervisorBargeCoachState {
  if (action.type === ACTION_SET_BARGE_COACH_STATUS) {
    // Return the extended state and the specific status of the above states
    // it requires you pass the name/value for each you wish to update
    return {
      ...state,
      ...action,
    };
  }

  // Default case if it doesn't meet the above action
  return state;
};
