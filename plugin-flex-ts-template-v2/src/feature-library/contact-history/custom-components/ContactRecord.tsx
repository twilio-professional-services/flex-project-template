import { Icon, Template, templates } from '@twilio/flex-ui';
import { Flex } from '@twilio-paste/core/flex';
import { Box } from '@twilio-paste/core/box';
import { Tooltip } from '@twilio-paste/core/tooltip';
import { Tr, Td } from '@twilio-paste/core/table';
import { ProductChatIcon } from '@twilio-paste/icons/esm/ProductChatIcon';
import { CallIncomingIcon } from '@twilio-paste/icons/esm/CallIncomingIcon';
import { CallOutgoingIcon } from '@twilio-paste/icons/esm/CallOutgoingIcon';
import { NotesIcon } from '@twilio-paste/icons/esm/NotesIcon';
import { PopoverContainer, PopoverButton, Popover } from '@twilio-paste/core/popover';
import { Text } from '@twilio-paste/core/text';
import { Heading } from '@twilio-paste/core/heading';

import { StringTemplates } from '../flex-hooks/strings';
import { Contact } from '../types';
import OutboundCallModal from './OutboundCallModal';

export interface OwnProps {
  contact: Contact;
}

const ContactRecord = (props: OwnProps) => {
  const { contact } = props;
  const {
    taskSid,
    channelType,
    direction,
    phoneNumber,
    twilioPhoneNumber,
    name,
    dateTime,
    duration,
    queueName,
    outcome,
    notes,
  } = contact;

  const taskDuration = `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`;

  return (
    <Tr key={taskSid}>
      <Td textAlign="center">
        <Flex hAlignContent="center">
          <Box>
            {channelType === 'voice' && direction === 'inbound' && (
              <Tooltip text={templates[StringTemplates.ContactInboundCall]()} placement="top">
                <div>
                  <CallIncomingIcon decorative={true} />
                </div>
              </Tooltip>
            )}
            {channelType === 'voice' && direction === 'outbound' && (
              <Tooltip text={templates[StringTemplates.ContactOutboundCall]()} placement="top">
                <div>
                  <CallOutgoingIcon decorative={true} />
                </div>
              </Tooltip>
            )}
            {channelType === 'sms' && <Icon icon="Sms" />}
            {channelType === 'web' && <Icon icon="Message" />}
            {channelType === 'whatsapp' && <Icon icon="Whatsapp" />}
            {channelType === 'custom' && <ProductChatIcon decorative={false} title="Custom Chat" />}
          </Box>
        </Flex>
      </Td>
      <Td>{twilioPhoneNumber}</Td>
      <Td>{phoneNumber}</Td>
      <Td>{channelType === 'voice' && <OutboundCallModal phoneNumber={phoneNumber || ''} />}</Td>
      <Td>{name ? <span>{name}</span> : <Template source={templates[StringTemplates.ContactDefaultCustomer]} />}</Td>
      <Td>{dateTime}</Td>
      <Td>{taskDuration}</Td>
      <Td>{queueName}</Td>
      <Td>{outcome}</Td>
      <Td>
        <PopoverContainer baseId="notes">
          <PopoverButton variant="secondary_icon" disabled={!notes}>
            <NotesIcon decorative={true} />
          </PopoverButton>
          <Popover aria-label="Popover">
            <Heading as="h3" variant="heading30">
              Notes
            </Heading>
            <Text as="p">{notes}</Text>
          </Popover>
        </PopoverContainer>
      </Td>
    </Tr>
  );
};

export default ContactRecord;
