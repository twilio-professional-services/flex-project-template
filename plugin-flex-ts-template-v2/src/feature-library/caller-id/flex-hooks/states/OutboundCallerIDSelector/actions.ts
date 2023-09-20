import { Manager } from '@twilio/flex-ui';

import { Action } from '../../../../../types/manager';
import PhoneNumberService from '../../../../../utils/serverless/PhoneNumbers/PhoneNumberService';
import { FETCH_PHONE_NUMBERS, SET_CALLER_ID } from './types';
import { isOutgoingOnlyNumbersEnabled } from '../../../config';

// Provide task to "pending" action as payload
// https://github.com/pburtchaell/redux-promise-middleware/blob/main/docs/guides/optimistic-updates.md

class Actions {
  public static getPhoneNumbers = (): Action => {
    return {
      type: FETCH_PHONE_NUMBERS,
      payload: {
        promise: PhoneNumberService.getAccountPhoneNumbers(isOutgoingOnlyNumbersEnabled()),
      },
    };
  };

  public static setCallerId = (selectedCallerId: string): Action => {
    const { workerClient } = Manager.getInstance();

    if (selectedCallerId === 'placeholder') {
      selectedCallerId = '';
    }

    return {
      type: SET_CALLER_ID,
      payload: {
        promise: workerClient?.setAttributes({ ...workerClient.attributes, selectedCallerId }),
      },
    };
  };
}

export default Actions;
