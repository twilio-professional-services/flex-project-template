import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { HistoricalContact } from '../../types';
import { getMaxContacts } from '../../config';

export interface ContactHistoryState {
  contactList: HistoricalContact[];
}

export interface AddContact {
  contact: HistoricalContact;
}

export interface SetContactList {
  contactList: HistoricalContact[];
}

const initialState = {
  contactList: [],
} as ContactHistoryState;

const contactHistorySlice = createSlice({
  name: 'contact_history',
  initialState,
  reducers: {
    addContact(state, action: PayloadAction<AddContact>) {
      let newContactList: HistoricalContact[] = [action.payload.contact];
      if (state.contactList) {
        newContactList = newContactList.concat(state.contactList).slice(0, getMaxContacts());
      }
      state.contactList = newContactList;
    },
    setContactList(state, action: PayloadAction<SetContactList>) {
      state.contactList = action.payload.contactList;
    },
    clearContactList(state) {
      state.contactList = [];
    },
  },
});

export const { addContact, setContactList, clearContactList } = contactHistorySlice.actions;
export const reducerHook = () => ({ contactHistory: contactHistorySlice.reducer });
