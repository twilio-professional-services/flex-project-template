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
import HistoricalContactRecord from './HistoricalContactRecord';
import { HistoricalContact } from '../../types';
import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import { StringTemplates } from '../../flex-hooks/strings';

const RecentTab = () => {
  const [confirmClearHistory, setConfirmClearHistory] = useState(false);

  const contactList = useSelector((state: AppState) => state[reduxNamespace]?.contacts?.recents);

  const clearHistory = () => {
    setConfirmClearHistory(false);
    ContactsUtil.clearRecents();
  };

  const closeClearHistory = () => setConfirmClearHistory(false);

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
                {contactList?.map((contact: HistoricalContact) => (
                  <HistoricalContactRecord key={contact.taskSid} contact={contact} />
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
    </>
  );
};

export default RecentTab;
