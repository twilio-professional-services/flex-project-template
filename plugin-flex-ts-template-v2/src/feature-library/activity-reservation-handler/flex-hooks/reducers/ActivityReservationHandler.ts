import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { PendingActivity } from '../../types/ActivityManager';

export interface ActivityReservationHandlerState {
  pendingActivity: PendingActivity | null;
}

const initialState = {
  pendingActivity: null,
} as ActivityReservationHandlerState;

const activityReservationHandlerSlice = createSlice({
  name: 'activityReservationHandler',
  initialState,
  reducers: {
    updatePendingActivity(state, action: PayloadAction<PendingActivity | null>) {
      state.pendingActivity = action.payload;
    },
  },
});

export const { updatePendingActivity } = activityReservationHandlerSlice.actions;
export const reducerHook = () => ({ activityReservationHandler: activityReservationHandlerSlice.reducer });
