import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ChannelNote {
  channelSid: string;
  dispositionCode: {
    topic_path: string;
    disposition_code: string;
  };
  sentiment: string;
  summary: string;
}

export interface ScreenPopSearchResult {
  id: string;
  type: string;
  name: string;
}

export interface ScreenPopSearchResultsPayload {
  reservationSid: string;
  results: ScreenPopSearchResult[];
}

export interface SalesforceIntegrationState {
  channelNotes: { [channelSid: string]: ChannelNote };
  screenPopSearchResults: { [reservationSid: string]: ScreenPopSearchResult[] };
}

const initialState = {
  channelNotes: {},
  screenPopSearchResults: {},
} as SalesforceIntegrationState;

const salesforceIntegrationSlice = createSlice({
  name: 'salesforceIntegration',
  initialState,
  reducers: {
    setChannelNote(state, action: PayloadAction<ChannelNote>) {
      state.channelNotes[action.payload.channelSid] = action.payload;
    },
    clearChannelNote(state, action: PayloadAction<string>) {
      if (!state.channelNotes[action.payload]) return;
      delete state.channelNotes[action.payload];
    },
    setSearchResults(state, action: PayloadAction<ScreenPopSearchResultsPayload>) {
      state.screenPopSearchResults[action.payload.reservationSid] = action.payload.results;
    },
    clearSearchResults(state, action: PayloadAction<string>) {
      if (!state.screenPopSearchResults[action.payload]) return;
      delete state.screenPopSearchResults[action.payload];
    },
  },
});

export const { setChannelNote, clearChannelNote, setSearchResults, clearSearchResults } =
  salesforceIntegrationSlice.actions;
export const reducerHook = () => ({ salesforceIntegration: salesforceIntegrationSlice.reducer });
