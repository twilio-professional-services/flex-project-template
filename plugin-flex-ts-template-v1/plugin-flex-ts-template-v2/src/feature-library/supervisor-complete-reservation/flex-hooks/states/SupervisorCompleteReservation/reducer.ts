import { createSlice } from '@reduxjs/toolkit';

import { UPDATE_RERSERVATION, prefix } from './types';
import initialState from './initialState';

const SupervisorCompleteReservationSlice = createSlice({
  name: prefix,
  initialState,
  reducers: {},
  extraReducers: {
    [`${UPDATE_RERSERVATION}_PENDING`]: (state, action) => {
      const { taskSid } = action.payload;
      state.isProcessingRequest[taskSid] = true;
    },
    [`${UPDATE_RERSERVATION}_REJECTED`]: (state, action) => {
      const { taskSid } = action.payload;
      state.isProcessingRequest[taskSid] = false;
    },
    [`${UPDATE_RERSERVATION}_FULFILLED`]: (state, action) => {
      const { taskSid } = action.payload;
      state.isProcessingRequest[taskSid] = false;
    },
  },
});

export const reducerHook = () => ({ supervisorCompleteReservation: SupervisorCompleteReservationSlice.reducer });
