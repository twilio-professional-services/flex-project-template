import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface QueueNoWorkerDataFilterState {
  selectedQueue: string;
}

export const ResetQueuePlaceholder = '__PS_QUEUE_FILTER_RESET__';

const initialState = { selectedQueue: '' } as QueueNoWorkerDataFilterState;

const queueNoWorkerDataFilterSlice = createSlice({
  name: 'queueNoWorkerDataFilter',
  initialState,
  reducers: {
    selectQueue(state, action: PayloadAction<string>) {
      state.selectedQueue = action.payload;
    },
  },
});

export const { selectQueue } = queueNoWorkerDataFilterSlice.actions;
export const reducerHook = () => ({ queueNoWorkerDataFilter: queueNoWorkerDataFilterSlice.reducer });
