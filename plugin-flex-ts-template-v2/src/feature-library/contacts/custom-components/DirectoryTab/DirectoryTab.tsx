import React, { useEffect, useState } from 'react';
import { templates, Template } from '@twilio/flex-ui';
import { useSelector } from 'react-redux';
import { Button } from '@twilio-paste/core/button';
import { Flex } from '@twilio-paste/core/flex';
import { Heading } from '@twilio-paste/core/heading';
import { Box } from '@twilio-paste/core/box';
import { Input } from '@twilio-paste/core/input';
import { DataGrid, DataGridHead, DataGridHeader, DataGridRow, DataGridBody } from '@twilio-paste/core/data-grid';
import { AlertDialog } from '@twilio-paste/core/alert-dialog';
import { PlusIcon } from '@twilio-paste/icons/esm/PlusIcon';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';
import debounce from 'lodash/debounce';

import ContactsUtil from '../../utils/ContactsUtil';
import ContactEditModal from './ContactEditModal';
import ContactRecord from './ContactRecord';
import Paginator from '../Paginator';
import { Contact } from '../../types';
import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import { StringTemplates } from '../../flex-hooks/strings';

export interface OwnProps {
  shared: boolean;
  allowEdits: boolean;
  pageSize: number;
}

const DirectoryTab = ({ shared, allowEdits, pageSize }: OwnProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null as Contact | null);
  const [contactToDelete, setContactToDelete] = useState(null as Contact | null);
  const [searchValue, setSearchValue] = useState('');
  const [currentPageContacts, setCurrentPageContacts] = useState([] as Contact[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const contactList = useSelector((state: AppState) =>
    shared ? state[reduxNamespace]?.contacts?.sharedDirectory : state[reduxNamespace]?.contacts?.directory,
  );

  useEffect(() => {
    if (!Boolean(searchValue)) {
      // Skip filtering if no search was specified
      setupPage(contactList);
      return;
    }
    // Search by all properties except these
    const keysToIgnore = ['key'];
    const searchValueLower = searchValue.toLowerCase();
    setupPage(
      contactList.filter((contact: Contact) => {
        for (const key of Object.keys(contact)) {
          if (keysToIgnore.includes(key)) continue;
          if (
            String((contact as any)[key])
              .toLowerCase()
              .includes(searchValueLower)
          )
            return true;
        }
        return false;
      }),
    );
  }, [contactList, currentPage, searchValue]);

  const setupPage = (contacts: Contact[]) => {
    const newTotalPages = Math.ceil(contacts.length / pageSize);
    const newStartIndex = (currentPage - 1) * pageSize;
    setTotalPages(newTotalPages);
    if (contacts.length && contacts.length <= newStartIndex) {
      // If the current page is no longer valid, such as after searching, jump to the new last page
      setCurrentPage(newTotalPages);
      return;
    }
    setCurrentPageContacts(contacts.slice(newStartIndex, Math.min(currentPage * pageSize, contacts.length)));
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setContactToEdit(null);
  };

  const addContact = () => {
    setContactToEdit(null);
    setEditModalOpen(true);
  };

  const deleteContact = (contact: Contact) => {
    setContactToDelete(contact);
  };

  const editContact = (contact: Contact) => {
    setContactToEdit(contact);
    setEditModalOpen(true);
  };

  const performDelete = async () => {
    if (!contactToDelete) {
      return;
    }
    await ContactsUtil.deleteContact(contactToDelete.key, shared);
    setContactToDelete(null);
  };

  const filterDirectory = (value: string) => {
    setSearchValue(value);
  };

  const filterDirectoryDebounce = debounce(filterDirectory, 500, { maxWait: 1000 });

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    filterDirectoryDebounce(e.target.value);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {!contactList || contactList.length === 0 ? (
        <Flex vertical width="100%" hAlignContent="center" padding="space50">
          <Heading as="h5" variant="heading50">
            <Template source={templates[StringTemplates.NoContacts]} />
          </Heading>
          {allowEdits && (
            <Box marginTop="space50">
              <Button variant="primary" onClick={addContact}>
                <PlusIcon decorative />
                <Template source={templates[StringTemplates.ContactAdd]} />
              </Button>
            </Box>
          )}
        </Flex>
      ) : (
        <Flex vertical hAlignContent="right">
          <Box width="100%">
            <Flex hAlignContent="between" marginBottom="space50" grow shrink>
              <Box maxWidth="300px">
                <Input
                  insertBefore={<SearchIcon decorative={true} />}
                  type="text"
                  key={`directory-search-field-${shared}`}
                  onChange={onSearch}
                  placeholder={templates[StringTemplates.ContactSearch]()}
                />
              </Box>
              {allowEdits && (
                <Button variant="primary" onClick={addContact}>
                  <PlusIcon decorative />
                  <Template source={templates[StringTemplates.ContactAdd]} />
                </Button>
              )}
            </Flex>
          </Box>
          <Box width="100%">
            <DataGrid
              variant="default"
              striped
              aria-label={
                shared ? templates[StringTemplates.SharedContacts]() : templates[StringTemplates.MyContacts]()
              }
              element="CONTACTS_TABLE"
            >
              <DataGridHead>
                <DataGridRow>
                  <DataGridHeader element="CONTACTS_TABLE_CELL">
                    <Template source={templates[StringTemplates.ContactName]} />
                  </DataGridHeader>
                  <DataGridHeader element="CONTACTS_TABLE_CELL">
                    <Template source={templates[StringTemplates.ContactPhoneNumber]} />
                  </DataGridHeader>
                  <DataGridHeader element="CONTACTS_TABLE_CELL" textAlign="right">
                    <Template source={templates[StringTemplates.ContactActions]} />
                  </DataGridHeader>
                </DataGridRow>
              </DataGridHead>
              <DataGridBody>
                {currentPageContacts?.map((contact: Contact) => (
                  <ContactRecord
                    key={contact.key}
                    contact={contact}
                    allowEdits={allowEdits}
                    editContact={editContact}
                    deleteContact={deleteContact}
                  />
                ))}
              </DataGridBody>
            </DataGrid>
            <Flex hAlignContent="center" marginTop="space50">
              <Paginator currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
            </Flex>
          </Box>
        </Flex>
      )}
      <AlertDialog
        heading={templates[StringTemplates.ContactDelete]()}
        isOpen={Boolean(contactToDelete)}
        onConfirm={performDelete}
        onConfirmLabel={templates.ConfirmableDialogConfirmButton()}
        onDismiss={() => setContactToDelete(null)}
        onDismissLabel={templates.ConfirmableDialogCancelButton()}
      >
        <Template source={templates[StringTemplates.ContactDeleteConfirm]} name={contactToDelete?.name} />
      </AlertDialog>
      <ContactEditModal contact={contactToEdit} isOpen={editModalOpen} shared={shared} handleClose={closeEditModal} />
    </>
  );
};

export default DirectoryTab;
