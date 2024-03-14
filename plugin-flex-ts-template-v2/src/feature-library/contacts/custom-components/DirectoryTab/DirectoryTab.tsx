import React, { useEffect, useState } from 'react';
import { templates, Template } from '@twilio/flex-ui';
import { useSelector } from 'react-redux';
import { Button } from '@twilio-paste/core/button';
import { Flex } from '@twilio-paste/core/flex';
import { Heading } from '@twilio-paste/core/heading';
import { Box } from '@twilio-paste/core/box';
import { Input } from '@twilio-paste/core/input';
import { Table, THead, TBody, Tr, Th } from '@twilio-paste/core/table';
import { AlertDialog } from '@twilio-paste/core/alert-dialog';
import { PlusIcon } from '@twilio-paste/icons/esm/PlusIcon';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';
import debounce from 'lodash/debounce';

import ContactsUtil from '../../utils/ContactsUtil';
import ContactEditModal from './ContactEditModal';
import ContactRecord from './ContactRecord';
import { Contact } from '../../types';
import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import { StringTemplates } from '../../flex-hooks/strings';

export interface OwnProps {
  shared: boolean;
  allowEdits: boolean;
}

const DirectoryTab = ({ shared, allowEdits }: OwnProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null as Contact | null);
  const [contactToDelete, setContactToDelete] = useState(null as Contact | null);
  const [searchValue, setSearchValue] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([] as Contact[]);

  const contactList = useSelector((state: AppState) =>
    shared ? state[reduxNamespace]?.contacts?.sharedDirectory : state[reduxNamespace]?.contacts?.directory,
  );

  useEffect(() => {
    if (!Boolean(searchValue)) {
      setFilteredContacts(contactList);
      return;
    }
    const searchValueLower = searchValue.toLowerCase();
    setFilteredContacts(
      contactList.filter(
        (contact: Contact) =>
          contact.name.toLowerCase().includes(searchValueLower) ||
          contact.notes.toLowerCase().includes(searchValueLower) ||
          contact.phoneNumber.toLowerCase().includes(searchValueLower),
      ),
    );
  }, [contactList, searchValue]);

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
            <Table variant="default" striped>
              <THead>
                <Tr>
                  <Th>
                    <Template source={templates[StringTemplates.ContactName]} />
                  </Th>
                  <Th>
                    <Template source={templates[StringTemplates.ContactPhoneNumber]} />
                  </Th>
                  <Th textAlign="right">
                    <Template source={templates[StringTemplates.ContactActions]} />
                  </Th>
                </Tr>
              </THead>
              <TBody>
                {filteredContacts?.map((contact: Contact) => (
                  <ContactRecord
                    key={contact.key}
                    contact={contact}
                    allowEdits={allowEdits}
                    editContact={editContact}
                    deleteContact={deleteContact}
                  />
                ))}
              </TBody>
            </Table>
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
