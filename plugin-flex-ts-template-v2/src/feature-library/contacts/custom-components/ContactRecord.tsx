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

const ContactRecord = ({ contact }: OwnProps) => {
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

  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor(duration / 60) % 60;
  const ss = (duration % 60).toString().padStart(2, '0');
  let mm = minutes.toString();
  if (hours > 0) mm = minutes.toString().padStart(2, '0');
  let taskDuration = hours > 0 ? `${hours}:` : '';
  taskDuration += `${mm}:${ss}`;

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
      <Td>{name ? <span>{name}</span> : <Template source={templates[StringTemplates.ContactDefaultCustomer]} />}</Td>
      <Td>{dateTime}</Td>
      <Td>{taskDuration}</Td>
      <Td>{queueName}</Td>
      <Td>{outcome}</Td>
      <Td>
        <Flex vAlignContent="center">
          {channelType === 'voice' && <OutboundCallModal phoneNumber={phoneNumber || ''} />}
          {notes && (
            <PopoverContainer baseId="notes">
              <PopoverButton variant="primary_icon" disabled={!notes}>
                <NotesIcon decorative={false} title={templates[StringTemplates.ContactNotes]()} />
              </PopoverButton>
              <Popover aria-label="Popover">
                <Heading as="h3" variant="heading30">
                  Notes
                </Heading>
                <Text as="p">{notes}</Text>
              </Popover>
            </PopoverContainer>
          )}
        </Flex>
      </Td>
    </Tr>
  );
};

export default ContactRecord;
