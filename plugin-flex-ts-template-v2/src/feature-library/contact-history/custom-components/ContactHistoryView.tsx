import React from 'react';
import { Actions, templates, Template } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@twilio-paste/core/button';
import { Flex } from '@twilio-paste/core/flex';
import { Box } from '@twilio-paste/core/box';
import { Table, THead, TBody, Tr, Th } from '@twilio-paste/core/table';

import { clearContactList } from '../flex-hooks/state';
import RecentContacts from '../utils/ContactsUtil';
import ContactRecord from './ContactRecord';
import { Contact } from '../types';
import AppState from '../../../types/manager/AppState';
import { reduxNamespace } from '../../../utils/state';
import { StringTemplates } from '../flex-hooks/strings';

const ContactHistory = () => {
  const contactData = useSelector((state: AppState) => {
    return { contactList: state[reduxNamespace]?.contactHistory?.contactList };
  });

  const contactList = contactData?.contactList || [];
  const dispatch = useDispatch();

  const startContact = async (contact: Contact) => {
    if (contact.channel === 'voice') {
      Actions.invokeAction('StartOutboundCall', {
        destination: contact.phoneNumber,
      });
    }
  };

  const clearHistory = () => {
    dispatch(clearContactList());
    RecentContacts.clearContactList();
  };

  return (
    <Flex width="100%">
      <Flex vertical width="100%" grow shrink>
        <Box padding="space40">
          <Button variant="primary" onClick={clearHistory}>
            <Template source={templates[StringTemplates.ClearHistory]} />
          </Button>
        </Box>
        <Box width="100%" padding="space40">
          <Table variant="borderless">
            <THead>
              <Tr>
                <Th>
                  <Template source={templates[StringTemplates.ContactChannel]} />
                </Th>
                <Th>
                  <Template source={templates[StringTemplates.ContactPhoneNumber]} />
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
                  <Template source={templates[StringTemplates.ContactNotes]} />
                </Th>
              </Tr>
            </THead>
            <TBody>
              {contactList?.map((contact: Contact) => (
                <ContactRecord key={contact.taskSid} contact={contact} startContact={startContact} />
              ))}
            </TBody>
          </Table>
        </Box>
      </Flex>
    </Flex>
  );
};

export default ContactHistory;
