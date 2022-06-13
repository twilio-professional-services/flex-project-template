import { Action } from '../../../../../flex-hooks/states'
import { CustomQueueTransferDirectoryState, UPDATE_QUEUES_LIST } from './types';

import initialState from './initialState';

// Reducer
export default function (state = initialState, action: Action): CustomQueueTransferDirectoryState {
  switch (action.type) {

    case `${UPDATE_QUEUES_LIST}`: {
      return {
        isFetchingQueueList: false,
        queuesList: action.payload
      };
    }

    default: {
      return state;
    }
  }
};
