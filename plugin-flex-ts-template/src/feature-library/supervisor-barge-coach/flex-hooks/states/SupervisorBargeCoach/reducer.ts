import { Action } from '../../../../../flex-hooks/states'
import { SupervisorBargeCoachState, ACTION_SET_BARGE_COACH_STATUS } from './types';

import initialState from './initialState';

// Exporting and adding a reducer for the states we will use later for the buttons
export default function(state = initialState, action: Action): SupervisorBargeCoachState  {
    switch (action.type) {
        // Return the extended state and the specific status of the above states
        // it requires you pass the name/value for each you wish to update
        case ACTION_SET_BARGE_COACH_STATUS: {
            return {
                ...state,
                ...action
            }
        }
        // Default case if it doesn't meet the above action
        default:
            return state;
    }
};
  