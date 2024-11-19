import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ConversationTransferState {
  pendingTransfers: Array<string>;
}

const initialState = { pendingTransfers: [] } as ConversationTransferState;

const conversationTransferSlice = createSlice({
  name: 'conversationTransfer',
  initialState,
  reducers: {
    addPendingTransfer(state, action: PayloadAction<string>) {
      state.pendingTransfers.push(action.payload);
    },
    removePendingTransfer(state, action: PayloadAction<string>) {
      state.pendingTransfers = state.pendingTransfers.filter((sid) => sid !== action.payload);
    },
  },
});

export const { addPendingTransfer, removePendingTransfer } = conversationTransferSlice.actions;
export const reducerHook = () => ({ conversationTransfer: conversationTransferSlice.reducer });
