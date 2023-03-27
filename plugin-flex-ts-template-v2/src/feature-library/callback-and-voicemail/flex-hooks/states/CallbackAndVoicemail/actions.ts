import * as Flex from '@twilio/flex-ui';

import { Action } from '../../../../../types/manager';
import CallbackService from '../../../utils/callback/CallbackService';
import { INITIATE_CALLBACK, REQUEUE_CALLBACK, PLACED_CALLBACK } from './types';

// Provide task to "pending" action as payload
// https://github.com/pburtchaell/redux-promise-middleware/blob/main/docs/guides/optimistic-updates.md

class Actions {
  public static callCustomer = (task: Flex.ITask): Action => {
    return {
      type: INITIATE_CALLBACK,
      payload: {
        promise: CallbackService.callCustomerBack(task, 0),
        data: task,
      },
    };
  };

  public static requeueCallback = (task: Flex.ITask): Action => {
    return {
      type: REQUEUE_CALLBACK,
      payload: {
        promise: CallbackService.requeueCallback(task),
        data: task,
      },
    };
  };

  public static setLastPlacedCallback = (task?: Flex.ITask): Action => {
    const payload = task ? task.sid : null;

    return {
      type: PLACED_CALLBACK,
      payload,
    };
  };
}

export default Actions;
