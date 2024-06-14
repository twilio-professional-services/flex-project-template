import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ExtendedWrapupState {
  extendedReservationSids: Array<string>;
}

const initialState = { extendedReservationSids: [] } as ExtendedWrapupState;

const extendedWrapupSlice = createSlice({
  name: 'extendedWrapup',
  initialState,
  reducers: {
    add(state, action: PayloadAction<string>) {
      if (!state.extendedReservationSids.includes(action.payload)) {
        state.extendedReservationSids.push(action.payload);
      }
    },
    remove(state, action: PayloadAction<string>) {
      const itemIndex = state.extendedReservationSids.findIndex((sid) => sid === action.payload);
      if (itemIndex >= 0) {
        state.extendedReservationSids.splice(itemIndex, 1);
      }
    },
  },
});

export const { add, remove } = extendedWrapupSlice.actions;
export const reducerHook = () => ({ extendedWrapup: extendedWrapupSlice.reducer });
