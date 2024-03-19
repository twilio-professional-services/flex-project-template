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
import { DeleteIcon } from '@twilio-paste/icons/esm/DeleteIcon';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';
import debounce from 'lodash/debounce';

import ContactsUtil from '../../utils/ContactsUtil';
import HistoricalContactRecord from './HistoricalContactRecord';
import Paginator from '../Paginator';
import { HistoricalContact } from '../../types';
import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import { StringTemplates } from '../../flex-hooks/strings';

export interface OwnProps {
  pageSize: number;
}

const RecentTab = ({ pageSize }: OwnProps) => {
  const [confirmClearHistory, setConfirmClearHistory] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [currentPageContacts, setCurrentPageContacts] = useState([] as HistoricalContact[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const contactList = useSelector((state: AppState) => state[reduxNamespace]?.contacts?.recents);

  useEffect(() => {
    if (!Boolean(searchValue)) {
      // Skip filtering if no search was specified
      setupPage(contactList);
      return;
    }
    // Search by all properties except these
    const keysToIgnore = ['taskSid', 'direction', 'channelType', 'dateTime', 'duration'];
    const searchValueLower = searchValue.toLowerCase();
    setupPage(
      contactList.filter((contact: HistoricalContact) => {
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

  const setupPage = (contacts: HistoricalContact[]) => {
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

  const clearHistory = () => {
    setConfirmClearHistory(false);
    ContactsUtil.clearRecents();
  };

  const closeClearHistory = () => setConfirmClearHistory(false);

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
            <Template source={templates[StringTemplates.NoHistory]} />
          </Heading>
        </Flex>
      ) : (
        <Flex vertical hAlignContent="center">
          <Box width="100%">
            <Flex hAlignContent="between" marginBottom="space50" grow shrink>
              <Box maxWidth="300px">
                <Input
                  insertBefore={<SearchIcon decorative={true} />}
                  type="text"
                  key={`directory-search-field-recent`}
                  onChange={onSearch}
                  placeholder={templates[StringTemplates.ContactSearch]()}
                />
              </Box>
              <Button variant="destructive_secondary" onClick={async () => setConfirmClearHistory(true)}>
                <DeleteIcon decorative={true} />
                <Template source={templates[StringTemplates.ClearHistory]} />
              </Button>
              <AlertDialog
                heading={templates[StringTemplates.ClearHistory]()}
                isOpen={confirmClearHistory}
                onConfirm={clearHistory}
                onConfirmLabel={templates.ConfirmableDialogConfirmButton()}
                onDismiss={closeClearHistory}
                onDismissLabel={templates.ConfirmableDialogCancelButton()}
              >
                <Template source={templates[StringTemplates.ClearHistoryDialog]} />
              </AlertDialog>
            </Flex>
          </Box>
          <Box width="100%">
            <DataGrid
              variant="default"
              striped
              aria-label={templates[StringTemplates.Recent]()}
              element="CONTACTS_TABLE"
            >
              <DataGridHead>
                <DataGridRow>
                  <DataGridHeader element="CONTACTS_TABLE_CELL">
                    <Template source={templates[StringTemplates.ContactChannel]} />
                  </DataGridHeader>
                  <DataGridHeader element="CONTACTS_TABLE_CELL">
                    <Template source={templates[StringTemplates.ContactInboundAddress]} />
                  </DataGridHeader>
                  <DataGridHeader element="CONTACTS_TABLE_CELL">
                    <Template source={templates[StringTemplates.ContactCustomerAddress]} />
                  </DataGridHeader>
                  <DataGridHeader element="CONTACTS_TABLE_CELL">
                    <Template source={templates[StringTemplates.ContactName]} />
                  </DataGridHeader>
                  <DataGridHeader element="CONTACTS_TABLE_CELL">
                    <Template source={templates[StringTemplates.ContactDateTime]} />
                  </DataGridHeader>
                  <DataGridHeader element="CONTACTS_TABLE_CELL">
                    <Template source={templates[StringTemplates.ContactDuration]} />
                  </DataGridHeader>
                  <DataGridHeader element="CONTACTS_TABLE_CELL">
                    <Template source={templates[StringTemplates.ContactQueue]} />
                  </DataGridHeader>
                  <DataGridHeader element="CONTACTS_TABLE_CELL">
                    <Template source={templates[StringTemplates.ContactOutcome]} />
                  </DataGridHeader>
                  <DataGridHeader element="CONTACTS_TABLE_CELL" textAlign="right">
                    <Template source={templates[StringTemplates.ContactActions]} />
                  </DataGridHeader>
                </DataGridRow>
              </DataGridHead>
              <DataGridBody>
                {currentPageContacts?.map((contact: HistoricalContact) => (
                  <HistoricalContactRecord key={contact.taskSid} contact={contact} />
                ))}
              </DataGridBody>
            </DataGrid>
            <Flex hAlignContent="center" marginTop="space50">
              <Paginator currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
            </Flex>
          </Box>
        </Flex>
      )}
    </>
  );
};

export default RecentTab;
