Use this example Redux Toolkit slice as a starting point for keeping Redux state within your feature.

```ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ExampleState {
  myValue: boolean;
  myOtherValue: boolean;
}

const initialState = {
  myValue: false,
  myOtherValue: false,
} as ExampleState;

const exampleSlice = createSlice({
  name: "exampleStateName",
  initialState,
  reducers: {
    updateMyValue(state, action: PayloadAction<boolean>) {
      state.myValue = action.payload;
    },
    updateMyOtherValue(state, action: PayloadAction<boolean>) {
      state.myOtherValue = action.payload;
    },
  },
});

export const { updateMyValue, updateMyOtherValue } = exampleSlice.actions;
export const reducerHook = () => ({ exampleStateName: exampleSlice.reducer });
```