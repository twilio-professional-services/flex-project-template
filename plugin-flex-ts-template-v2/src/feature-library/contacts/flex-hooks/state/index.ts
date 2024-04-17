import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { Contact, HistoricalContact } from '../../types';

export interface ContactsState {
  recents: HistoricalContact[];
  directory: Contact[];
  sharedDirectory: Contact[];
}

export interface UpdateContactPayload {
  shared: boolean;
  contact: Contact;
}

export interface RemoveContactPayload {
  shared: boolean;
  key: string;
}

export interface InitDirectoryPayload {
  shared: boolean;
  contacts: Contact[];
}

const initialState = {
  recents: [],
  directory: [],
  sharedDirectory: [],
} as ContactsState;

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addHistoricalContact(state, action: PayloadAction<HistoricalContact>) {
      let newRecentsList: HistoricalContact[] = [action.payload];
      if (state.recents) {
        newRecentsList = newRecentsList.concat(state.recents);
      }
      state.recents = newRecentsList;
    },
    initRecents(state, action: PayloadAction<HistoricalContact[]>) {
      state.recents = action.payload;
    },
    clearRecents(state) {
      state.recents = [];
    },
    addDirectoryContact(state, action: PayloadAction<UpdateContactPayload>) {
      const directory = action.payload.shared ? state.sharedDirectory : state.directory;
      directory.push(action.payload.contact);
      directory.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
    },
    updateDirectoryContact(state, action: PayloadAction<UpdateContactPayload>) {
      const directory = action.payload.shared ? state.sharedDirectory : state.directory;
      const contactIndex = directory.findIndex((contact) => contact.key === action.payload.contact.key);
      directory[contactIndex] = action.payload.contact;
      directory.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
    },
    removeDirectoryContact(state, action: PayloadAction<RemoveContactPayload>) {
      if (action.payload.shared) {
        state.sharedDirectory = state.sharedDirectory.filter((contact) => contact.key !== action.payload.key);
      } else {
        state.directory = state.directory.filter((contact) => contact.key !== action.payload.key);
      }
    },
    initDirectory(state, action: PayloadAction<InitDirectoryPayload>) {
      if (action.payload.shared) {
        state.sharedDirectory = action.payload.contacts;
      } else {
        state.directory = action.payload.contacts;
      }
    },
  },
});

export const {
  addHistoricalContact,
  initRecents,
  clearRecents,
  addDirectoryContact,
  updateDirectoryContact,
  removeDirectoryContact,
  initDirectory,
} = contactsSlice.actions;
export const reducerHook = () => ({ contacts: contactsSlice.reducer });
