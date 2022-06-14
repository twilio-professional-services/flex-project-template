import * as Flex from '@twilio/flex-ui';
import { Action } from '../../../../../flex-hooks/states'
import { CallbackState, INITIATE_CALLBACK } from './types';

import initialState from './initialState';

// Reducer
export default function (state = initialState, action: Action): CallbackState {
  switch (action.type) {

    case `${INITIATE_CALLBACK}_PENDING`: {
      const { taskSid } = action.payload as Flex.ITask;
      return {
        ...state,
        isCompletingCallbackAction: {
          ...state.isCompletingCallbackAction,
          [taskSid]: true
        }
      };
    }

    case `${INITIATE_CALLBACK}_REJECTED`:

    case `${INITIATE_CALLBACK}_FULFILLED`: {
      const { taskSid } = action.payload as Flex.ITask;
      const isCompletingCallbackAction = state.isCompletingCallbackAction;
      delete isCompletingCallbackAction[taskSid];

      return {
        ...state,
        isCompletingCallbackAction
      };
    }

    default: {
      return state;
    }
  }
};
