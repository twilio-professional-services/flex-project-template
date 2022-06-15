import { Action } from '../../../../../flex-hooks/states'
import { OutboundCallerIDSelectorState, FETCH_PHONE_NUMBERS, SET_CALLER_ID } from './types';
import { ListPhoneNumbersResponse } from '../../../../../utils/serverless/PhoneNumbers/PhoneNumberService';
import initialState from './initialState';
import Worker from '../../../../../types/task-router/Worker';

// Reducer
export default function (state = initialState, action: Action): OutboundCallerIDSelectorState {
  switch (action.type) {

    case `${FETCH_PHONE_NUMBERS}_PENDING`: {
      return {
        ...state,
        isFetchingPhoneNumbers: true
      }
    }

    case `${FETCH_PHONE_NUMBERS}_REJECTED`: {
      return {
        ...state,
        isFetchingPhoneNumbers: false,
        fetchingPhoneNumbersFailed: true
      };
    }

    case `${FETCH_PHONE_NUMBERS}_FULFILLED`: {
      const serviceResponse = action.payload as ListPhoneNumbersResponse;
      return {
        ...state,
        isFetchingPhoneNumbers: false,
        phoneNumbers: serviceResponse.phoneNumbers
      };
    }

    case `${SET_CALLER_ID}_PENDING`: {
      return {
        ...state,
        isUpdatingAttributes: true
      }
    }

    case `${SET_CALLER_ID}_REJECTED`: {
      return {
        ...state,
        isUpdatingAttributes: false,
        updatingAttributesFailed: true
      };
    }

    case `${SET_CALLER_ID}_FULFILLED`: {
      const { attributes } = action.payload as Worker;
      return {
        ...state,
        isUpdatingAttributes: false,
        selectedCallerId: attributes.selectedCallerId
      };
    }

    default: {
      return state;
    }
  }
};
