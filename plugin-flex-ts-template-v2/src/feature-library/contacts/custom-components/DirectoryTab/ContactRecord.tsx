import { templates } from '@twilio/flex-ui';
import { Flex } from '@twilio-paste/core/flex';
import { Button } from '@twilio-paste/core/button';
import { DeleteIcon } from '@twilio-paste/icons/esm/DeleteIcon';
import { EditIcon } from '@twilio-paste/icons/esm/EditIcon';
import { DataGridRow, DataGridCell } from '@twilio-paste/core/data-grid';

import { StringTemplates } from '../../flex-hooks/strings';
import { Contact } from '../../types';
import NotesPopover from '../NotesPopover';
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
    <DataGridRow key={key}>
      <DataGridCell element="CONTACTS_TABLE_CELL">{name}</DataGridCell>
      <DataGridCell element="CONTACTS_TABLE_CELL">{phoneNumber}</DataGridCell>
      <DataGridCell element="CONTACTS_TABLE_CELL" textAlign="right">
        <Flex vAlignContent="center" hAlignContent="right">
          {notes && <NotesPopover notes={notes} />}
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
      </DataGridCell>
    </DataGridRow>
  );
};

export default ContactRecord;
