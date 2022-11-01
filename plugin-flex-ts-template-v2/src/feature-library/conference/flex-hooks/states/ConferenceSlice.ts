import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ConnectingParticipant } from '../../types/ConnectingParticipant';

export interface ConferenceState {
  connectingParticipants: Array<ConnectingParticipant>;
}

const initialState = { connectingParticipants: [] } as ConferenceState

const conferenceSlice = createSlice({
  name: 'conference',
  initialState,
  reducers: {
    addConnectingParticipant(state, action: PayloadAction<ConnectingParticipant>) {
      state.connectingParticipants.push(action.payload);
    },
    removeConnectingParticipant(state, action: PayloadAction<string>) {
      const participantIndex = state.connectingParticipants.findIndex((p) => p.callSid == action.payload);
      
      if (participantIndex >= 0) {
        state.connectingParticipants.splice(participantIndex, 1);
      }
    },
  },
})

export const { addConnectingParticipant, removeConnectingParticipant } = conferenceSlice.actions
export default conferenceSlice.reducer