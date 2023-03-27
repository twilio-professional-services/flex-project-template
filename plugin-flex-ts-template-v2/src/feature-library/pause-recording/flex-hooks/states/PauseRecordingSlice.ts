import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { PausedRecording } from '../../types/PausedRecording';

export interface PauseRecordingState {
  pausedRecordings: Array<PausedRecording>;
}

const initialState = { pausedRecordings: [] } as PauseRecordingState;

const pauseRecordingSlice = createSlice({
  name: 'pauseRecording',
  initialState,
  reducers: {
    pause(state, action: PayloadAction<PausedRecording>) {
      state.pausedRecordings.push(action.payload);
    },
    resume(state, action: PayloadAction<number>) {
      state.pausedRecordings.splice(action.payload, 1);
    },
  },
});

export const { pause, resume } = pauseRecordingSlice.actions;
export const reducerHook = () => ({ pauseRecording: pauseRecordingSlice.reducer });
