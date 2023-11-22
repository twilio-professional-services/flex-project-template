import { Icon, templates } from '@twilio/flex-ui';
import { Flex } from '@twilio-paste/core/flex';
import { Box } from '@twilio-paste/core/box';
import { Tooltip } from '@twilio-paste/core/tooltip';
import { Tr, Td } from '@twilio-paste/core/table';
import { ProductChatIcon } from '@twilio-paste/icons/esm/ProductChatIcon';
import { CallIncomingIcon } from '@twilio-paste/icons/esm/CallIncomingIcon';
import { CallOutgoingIcon } from '@twilio-paste/icons/esm/CallOutgoingIcon';

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
  const taskDuration = duration > 60 ? `${Math.floor(duration / 60)}:${duration % 60}` : `${duration}s`;

  let agentNotes = notes;
  if (notes && notes?.length > 20) agentNotes = notes.substring(0, 20).concat('...');

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
            {channelType === 'custom' && <ProductChatIcon decorative={false} title="Custom Chat" />}
          </Box>
        </Flex>
      </Td>
      <Td>{twilioPhoneNumber}</Td>
      <Td>{channelType === 'voice' ? <OutboundCallModal phoneNumber={phoneNumber || ''} /> : { phoneNumber }}</Td>
      <Td>{name}</Td>
      <Td>{dateTime}</Td>
      <Td>{taskDuration}</Td>
      <Td>{queueName}</Td>
      <Td>{outcome}</Td>
      <Td>
        {agentNotes && (
          <Tooltip text={notes || ''} placement="left">
            <div>{agentNotes} </div>
          </Tooltip>
        )}
      </Td>
    </Tr>
  );
};

export default ContactRecord;
