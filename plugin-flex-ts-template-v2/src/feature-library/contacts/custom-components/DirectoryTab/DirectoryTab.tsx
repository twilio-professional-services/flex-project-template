import React, { useState } from 'react';
import { templates, Template } from '@twilio/flex-ui';
import { useSelector } from 'react-redux';
import { Button } from '@twilio-paste/core/button';
import { Flex } from '@twilio-paste/core/flex';
import { Heading } from '@twilio-paste/core/heading';
import { Box } from '@twilio-paste/core/box';
import { Table, THead, TBody, Tr, Th } from '@twilio-paste/core/table';
import { AlertDialog } from '@twilio-paste/core/alert-dialog';
import { DeleteIcon } from '@twilio-paste/icons/esm/DeleteIcon';

import ContactsUtil from '../../utils/ContactsUtil';
import ContactRecord from './ContactRecord';
import { Contact } from '../../types';
import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import { StringTemplates } from '../../flex-hooks/strings';

export interface OwnProps {
  shared: boolean;
}

const RecentTab = ({ shared }: OwnProps) => {
  const contactList = useSelector((state: AppState) =>
    shared ? state[reduxNamespace]?.contacts?.sharedDirectory : state[reduxNamespace]?.contacts?.directory,
  );

  return (
    <>
      {!contactList || contactList.length === 0 ? (
        <Flex vertical width="100%" hAlignContent="center" padding="space50">
          <Heading as="h5" variant="heading50">
            <Template source={templates[StringTemplates.NoContacts]} />
          </Heading>
        </Flex>
      ) : (
        <Flex vertical hAlignContent="center">
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
                {contactList?.map((contact: Contact) => (
                  <ContactRecord key={contact.key} contact={contact} />
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
