import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ITask } from '@twilio/flex-ui';

export interface CustomerDisplayState {
  currentTask: ITask | null;
}

const initialState: CustomerDisplayState = {
  currentTask: null,
};

const customerDisplaySlice = createSlice({
  name: 'customerDisplay',
  initialState,
  reducers: {
    setCurrentTask(state, action: PayloadAction<ITask | null>) {
      state.currentTask = action.payload;
    },
  },
});

export const { setCurrentTask } = customerDisplaySlice.actions;
export const reducerHook = () => ({ customerDisplay: customerDisplaySlice.reducer });
