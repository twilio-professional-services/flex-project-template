import { Icon, templates } from '@twilio/flex-ui';
import { Button } from '@twilio-paste/core/button';
import { Flex } from '@twilio-paste/core/flex';
import { Box } from '@twilio-paste/core/box';
import { Tooltip } from '@twilio-paste/core/tooltip';
import { Tr, Td } from '@twilio-paste/core/table';
import { ProductChatIcon } from '@twilio-paste/icons/esm/ProductChatIcon';
import { CallIncomingIcon } from '@twilio-paste/icons/esm/CallIncomingIcon';
import { CallOutgoingIcon } from '@twilio-paste/icons/esm/CallOutgoingIcon';

import { StringTemplates } from '../flex-hooks/strings';
import { Contact } from '../types';

export interface OwnProps {
  contact: Contact;
  startContact: (contact: Contact) => void;
}

const ContactRecord = (props: OwnProps) => {
  const { contact, startContact } = props;
  return (
    <Tr key={contact.taskSid}>
      <Td textAlign="center">
        <Flex hAlignContent="center">
          <Box>
            {contact.channelType === 'voice' && contact.direction === 'inbound' && (
              <Tooltip text={templates[StringTemplates.ContactInboundCall]()} placement="top">
                <div>
                  <CallIncomingIcon decorative={true} />
                </div>
              </Tooltip>
            )}
            {contact.channelType === 'voice' && contact.direction === 'outbound' && (
              <Tooltip text={templates[StringTemplates.ContactOutboundCall]()} placement="top">
                <div>
                  <CallOutgoingIcon decorative={true} />
                </div>
              </Tooltip>
            )}
            {contact.channelType === 'sms' && <Icon icon="Sms" />}
            {contact.channelType === 'web' && <Icon icon="Message" />}
            {contact.channelType === 'custom' && <ProductChatIcon decorative={false} title="Custom Chat" />}
          </Box>
        </Flex>
      </Td>
      <Td>
        <Button
          variant="link"
          size="small"
          title="Click to Call"
          onClick={() => {
            startContact(contact);
          }}
        >
          {contact.phoneNumber}
        </Button>
      </Td>
      <Td>{contact.name}</Td>
      <Td>{contact.dateTime}</Td>
      <Td textAlign="center">{contact.duration}</Td>
      <Td>{contact.queueName}</Td>
      <Td>{contact.outcome}</Td>
      <Td>
        {contact.notes && (
          <Tooltip text={contact.notes} placement="bottom">
            <div>{contact.notes.substring(0, 20).concat('...')} </div>
          </Tooltip>
        )}
      </Td>
    </Tr>
  );
};

export default ContactRecord;
