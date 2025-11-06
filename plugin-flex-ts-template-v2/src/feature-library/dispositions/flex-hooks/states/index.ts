import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface DispositionsState {
  tasks: { [sid: string]: DispositionsTaskState };
}

export interface DispositionsTaskState {
  disposition: string;
  notes: string;
  custom_attributes: { [key: string]: string };
}

export interface DispositionsTaskStringUpdate {
  taskSid: string;
  value: string;
}

export interface DispositionsTaskAttributeUpdate {
  taskSid: string;
  value: { [key: string]: string };
}

const initialState = {
  tasks: {},
} as DispositionsState;

const dispositionsSlice = createSlice({
  name: 'dispositions',
  initialState,
  reducers: {
    updateDisposition(state, action: PayloadAction<DispositionsTaskStringUpdate>) {
      state.tasks = {
        ...state.tasks,
        [action.payload.taskSid]: {
          ...state.tasks[action.payload.taskSid],
          disposition: action.payload.value,
        },
      };
    },
    updateNotes(state, action: PayloadAction<DispositionsTaskStringUpdate>) {
      state.tasks = {
        ...state.tasks,
        [action.payload.taskSid]: {
          ...state.tasks[action.payload.taskSid],
          notes: action.payload.value,
        },
      };
    },
    updateCustomAttributes(state, action: PayloadAction<DispositionsTaskAttributeUpdate>) {
      state.tasks = {
        ...state.tasks,
        [action.payload.taskSid]: {
          ...state.tasks[action.payload.taskSid],
          custom_attributes: { ...action.payload.value },
        },
      };
    },
  },
});

export const { updateDisposition, updateNotes, updateCustomAttributes } = dispositionsSlice.actions;
export const reducerHook = () => ({ dispositions: dispositionsSlice.reducer });
