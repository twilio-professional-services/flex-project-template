import { Icon } from '@twilio/flex-ui';
import { Button } from '@twilio-paste/core/button';
import { Flex } from '@twilio-paste/core/flex';
import { Box } from '@twilio-paste/core/box';
import { Tooltip } from '@twilio-paste/core/tooltip';
import { Tr, Td } from '@twilio-paste/core/table';
import { ArrowBackIcon } from '@twilio-paste/icons/esm/ArrowBackIcon';
import { ArrowForwardIcon } from '@twilio-paste/icons/esm/ArrowForwardIcon';
import { ProductChatIcon } from '@twilio-paste/icons/esm/ProductChatIcon';

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
            {contact.channelType === 'voice' && (
              <Button
                variant="link"
                size="small"
                title="Call"
                onClick={() => {
                  startContact(contact);
                }}
              >
                <Icon icon="Call" />
                {contact.direction === 'inbound' && <ArrowBackIcon decorative={false} title="Incoming" />}
                {contact.direction === 'outbound' && <ArrowForwardIcon decorative={false} title="Outgoing" />}
              </Button>
            )}
            {contact.channelType === 'sms' && <Icon icon="Sms" />}
            {contact.channelType === 'web' && <Icon icon="Message" />}
            {contact.channelType === 'custom' && <ProductChatIcon decorative={false} title="Custom Chat" />}
          </Box>
        </Flex>
      </Td>
      <Td>{contact.phoneNumber}</Td>
      <Td>{contact.name}</Td>
      <Td>{contact.dateTime}</Td>
      <Td textAlign="center">{contact.duration}</Td>
      <Td>{contact.queueName}</Td>
      <Td>{contact.outcome}</Td>
      <Td>
        {contact.notes && (
          <Tooltip text={contact.notes} placement="bottom">
            <div>{contact.notes.substring(0, 10).concat('...')} </div>
          </Tooltip>
        )}
      </Td>
    </Tr>
  );
};

export default ContactRecord;
