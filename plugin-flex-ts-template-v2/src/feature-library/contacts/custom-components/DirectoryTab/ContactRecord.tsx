import { Template, templates } from '@twilio/flex-ui';
import { Flex } from '@twilio-paste/core/flex';
import { Tr, Td } from '@twilio-paste/core/table';
import { NotesIcon } from '@twilio-paste/icons/esm/NotesIcon';
import { PopoverContainer, PopoverButton, Popover } from '@twilio-paste/core/popover';
import { Text } from '@twilio-paste/core/text';
import { Heading } from '@twilio-paste/core/heading';

import { StringTemplates } from '../../flex-hooks/strings';
import { Contact } from '../../types';
import OutboundCallModal from '../OutboundCallModal';

export interface OwnProps {
  contact: Contact;
}

const ContactRecord = ({ contact }: OwnProps) => {
  const { key, phoneNumber, name, notes } = contact;

  return (
    <Tr key={key}>
      <Td>{name}</Td>
      <Td>{phoneNumber}</Td>
      <Td textAlign="right">
        <Flex vAlignContent="center" hAlignContent="right">
          {notes && (
            <PopoverContainer baseId="notes">
              <PopoverButton variant="primary_icon" disabled={!notes}>
                <NotesIcon decorative={false} title={templates[StringTemplates.ContactNotes]()} />
              </PopoverButton>
              <Popover aria-label="Popover">
                <Heading as="h3" variant="heading30">
                  <Template source={templates[StringTemplates.ContactNotes]} />
                </Heading>
                <Text as="p">{notes}</Text>
              </Popover>
            </PopoverContainer>
          )}
          <OutboundCallModal phoneNumber={phoneNumber || ''} />
        </Flex>
      </Td>
    </Tr>
  );
};

export default ContactRecord;
