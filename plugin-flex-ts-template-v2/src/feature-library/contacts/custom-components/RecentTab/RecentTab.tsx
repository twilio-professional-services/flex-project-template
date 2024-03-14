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
import { DeleteIcon } from '@twilio-paste/icons/esm/DeleteIcon';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';
import debounce from 'lodash/debounce';

import ContactsUtil from '../../utils/ContactsUtil';
import HistoricalContactRecord from './HistoricalContactRecord';
import { HistoricalContact } from '../../types';
import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import { StringTemplates } from '../../flex-hooks/strings';

const RecentTab = () => {
  const [confirmClearHistory, setConfirmClearHistory] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([] as HistoricalContact[]);

  const contactList = useSelector((state: AppState) => state[reduxNamespace]?.contacts?.recents);

  useEffect(() => {
    if (!Boolean(searchValue)) {
      setFilteredContacts(contactList);
      return;
    }
    const searchValueLower = searchValue.toLowerCase();
    setFilteredContacts(
      contactList.filter(
        (contact: HistoricalContact) =>
          contact.name?.toLowerCase().includes(searchValueLower) ||
          contact.notes?.toLowerCase().includes(searchValueLower) ||
          contact.outcome?.toLowerCase().includes(searchValueLower) ||
          contact.queueName?.toLowerCase().includes(searchValueLower) ||
          contact.twilioPhoneNumber?.toLowerCase().includes(searchValueLower) ||
          contact.phoneNumber?.toLowerCase().includes(searchValueLower),
      ),
    );
  }, [contactList, searchValue]);

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
            <Table variant="default" striped>
              <THead>
                <Tr>
                  <Th>
                    <Template source={templates[StringTemplates.ContactChannel]} />
                  </Th>
                  <Th>
                    <Template source={templates[StringTemplates.ContactInboundAddress]} />
                  </Th>
                  <Th>
                    <Template source={templates[StringTemplates.ContactCustomerAddress]} />
                  </Th>
                  <Th>
                    <Template source={templates[StringTemplates.ContactName]} />
                  </Th>
                  <Th>
                    <Template source={templates[StringTemplates.ContactDateTime]} />
                  </Th>
                  <Th align="center">
                    <Template source={templates[StringTemplates.ContactDuration]} />
                  </Th>
                  <Th>
                    <Template source={templates[StringTemplates.ContactQueue]} />
                  </Th>
                  <Th>
                    <Template source={templates[StringTemplates.ContactOutcome]} />
                  </Th>
                  <Th textAlign="right">
                    <Template source={templates[StringTemplates.ContactActions]} />
                  </Th>
                </Tr>
              </THead>
              <TBody>
                {filteredContacts?.map((contact: HistoricalContact) => (
                  <HistoricalContactRecord key={contact.taskSid} contact={contact} />
                ))}
              </TBody>
            </Table>
          </Box>
        </Flex>
      )}
    </>
  );
};

export default RecentTab;
