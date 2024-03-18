import { templates } from '@twilio/flex-ui';
import { Flex } from '@twilio-paste/core/flex';
import { Tr, Td } from '@twilio-paste/core/table';
import { Button } from '@twilio-paste/core/button';
import { DeleteIcon } from '@twilio-paste/icons/esm/DeleteIcon';
import { EditIcon } from '@twilio-paste/icons/esm/EditIcon';

import { StringTemplates } from '../../flex-hooks/strings';
import { Contact } from '../../types';
import OutboundCallModal from '../OutboundCallModal';

export interface OwnProps {
  contact: Contact;
  allowEdits: boolean;
  deleteContact: (contact: Contact) => void;
  editContact: (contact: Contact) => void;
}

const ContactRecord = ({ contact, allowEdits, deleteContact, editContact }: OwnProps) => {
  const { key, phoneNumber, name, notes } = contact;

  return (
    <Tr key={key}>
      <Td>{name}</Td>
      <Td>{phoneNumber}</Td>
      <Td>{notes}</Td>
      <Td textAlign="right">
        <Flex vAlignContent="center" hAlignContent="right">
          <OutboundCallModal phoneNumber={phoneNumber || ''} />
          {allowEdits && (
            <Flex marginLeft="space50">
              <Button
                variant="primary_icon"
                size="icon_small"
                title={templates[StringTemplates.ContactEdit]()}
                onClick={() => {
                  editContact(contact);
                }}
              >
                <EditIcon decorative={true} />
              </Button>
              <Button
                variant="destructive_icon"
                size="icon_small"
                title={templates[StringTemplates.ContactDelete]()}
                onClick={() => {
                  deleteContact(contact);
                }}
              >
                <DeleteIcon decorative={true} />
              </Button>
            </Flex>
          )}
        </Flex>
      </Td>
    </Tr>
  );
};

export default ContactRecord;
