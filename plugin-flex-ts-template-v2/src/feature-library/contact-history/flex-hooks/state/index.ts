import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { Contact } from '../../types';
import { getMaxContacts } from '../../config';

export interface ContactHistoryState {
  contactList: Contact[];
}

export interface AddContact {
  contact: Contact;
}

export interface SetContactList {
  contactList: Contact[];
}

const initialState = {
  contactList: [],
} as ContactHistoryState;

const contactHistorySlice = createSlice({
  name: 'contact_history',
  initialState,
  reducers: {
    addContact(state, action: PayloadAction<AddContact>) {
      let newContactList: Contact[] = [action.payload.contact];
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
