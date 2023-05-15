import { createSlice } from '@reduxjs/toolkit';
import { CustomWorkerAttributes } from 'types/task-router/Worker';

import { FETCH_PHONE_NUMBERS, SET_CALLER_ID, prefix } from './types';
import initialState from './initialState';

const OutboundCallerIDSelectorSlice = createSlice({
  name: prefix,
  initialState,
  reducers: {},
  extraReducers: {
    [`${FETCH_PHONE_NUMBERS}_PENDING`]: (state) => {
      state.isFetchingPhoneNumbers = true;
    },
    [`${FETCH_PHONE_NUMBERS}_REJECTED`]: (state) => {
      state.isFetchingPhoneNumbers = false;
      state.fetchingPhoneNumbersFailed = true;
    },
    [`${FETCH_PHONE_NUMBERS}_FULFILLED`]: (state, action) => {
      state.isFetchingPhoneNumbers = false;
      state.fetchingPhoneNumbersFailed = false;
      state.phoneNumbers = action.payload.phoneNumbers;
    },
    [`${SET_CALLER_ID}_PENDING`]: (state) => {
      state.isUpdatingAttributes = true;
    },
    [`${SET_CALLER_ID}_REJECTED`]: (state) => {
      state.isUpdatingAttributes = false;
      state.updatingAttributesFailed = true;
    },
    [`${SET_CALLER_ID}_FULFILLED`]: (state, action) => {
      state.isUpdatingAttributes = false;
      state.updatingAttributesFailed = false;

      if (!action.payload) return;
      state.selectedCallerId = (action.payload.attributes as CustomWorkerAttributes).selectedCallerId;
    },
  },
});

export const reducerHook = () => ({ outboundCallerIdSelector: OutboundCallerIDSelectorSlice.reducer });
