import React, { useState } from 'react';
import { templates, Template } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@twilio-paste/core/button';
import { Flex } from '@twilio-paste/core/flex';
import { Heading } from '@twilio-paste/core/heading';
import { Box } from '@twilio-paste/core/box';
import { Table, THead, TBody, Tr, Th } from '@twilio-paste/core/table';
import { AlertDialog } from '@twilio-paste/core/alert-dialog';
import { DeleteIcon } from '@twilio-paste/icons/esm/DeleteIcon';

import { clearContactList } from '../../flex-hooks/state';
import RecentContacts from '../../utils/ContactsUtil';
import ContactRecord from '../ContactRecord';
import { Contact } from '../../types';
import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import { StringTemplates } from '../../flex-hooks/strings';
import { ContactHistoryViewWrapper } from './ContactHistoryView.Styles';

const ContactHistory = () => {
  const [confirmClearHistory, setConfirmClearHistory] = useState(false);

  const contactData = useSelector((state: AppState) => {
    return { contactList: state[reduxNamespace]?.contactHistory?.contactList };
  });

  const contactList = contactData?.contactList || [];
  const dispatch = useDispatch();

  const clearHistory = () => {
    setConfirmClearHistory(false);
    dispatch(clearContactList());
    RecentContacts.clearContactList();
  };

  const closeClearHistory = () => setConfirmClearHistory(false);

  return (
    <ContactHistoryViewWrapper>
      <Flex width="100%" overflowY="auto" grow shrink>
        {!contactList || contactList.length === 0 ? (
          <Flex vertical width="100%" hAlignContent="center" padding="space50">
            <Heading as="h5" variant="heading50">
              <Template source={templates[StringTemplates.NoHistory]} />
            </Heading>
          </Flex>
        ) : (
          <Flex vertical width="100%" grow shrink hAlignContent="center">
            <Box overflowY="auto" width="100%" padding="space40">
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
                    <Th>
                      <Template source={templates[StringTemplates.ContactActions]} />
                    </Th>
                  </Tr>
                </THead>
                <TBody>
                  {contactList?.map((contact: Contact) => (
                    <ContactRecord key={contact.taskSid} contact={contact} />
                  ))}
                </TBody>
              </Table>
            </Box>
            <Box padding="space40">
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
            </Box>
          </Flex>
        )}
      </Flex>
    </ContactHistoryViewWrapper>
  );
};

export default ContactHistory;
