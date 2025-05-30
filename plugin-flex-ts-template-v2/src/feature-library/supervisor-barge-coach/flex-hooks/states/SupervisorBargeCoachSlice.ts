import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface SupervisorBargeCoachState {
  coaching: boolean;
  muted: boolean;
  supervisorArray: Array<any>;
  privateMode: boolean;
  agentAssistanceButton: boolean;
  enableAgentAssistanceAlerts: boolean;
  agentAssistanceArray: Array<any>;
}

const initialState = {
  coaching: false,
  muted: true,
  supervisorArray: [],
  privateMode: false,
  agentAssistanceButton: false,
  enableAgentAssistanceAlerts: true,
  agentAssistanceArray: [],
} as SupervisorBargeCoachState;

const supervisorBargeCoachSlice = createSlice({
  name: 'supervisorBargeCoach',
  initialState,
  reducers: {
    setBargeCoachStatus(state, action: PayloadAction<any>) {
      for (const key of Object.keys(action.payload)) {
        (state as any)[key] = action.payload[key];
      }
    },
    listen(state) {
      state.muted = true;
      state.coaching = false;
    },
    coach(state) {
      state.muted = false;
      state.coaching = true;
    },
    barge(state) {
      state.muted = false;
      state.coaching = false;
    },
  },
});

export const { setBargeCoachStatus, listen, coach, barge } = supervisorBargeCoachSlice.actions;
export const reducerHook = () => ({ supervisorBargeCoach: supervisorBargeCoachSlice.reducer });
