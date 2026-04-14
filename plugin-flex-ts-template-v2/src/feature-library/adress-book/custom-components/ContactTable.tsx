import React from 'react';
import { DataGrid, DataGridHead, DataGridBody, DataGridRow, DataGridCell } from '@twilio-paste/core/data-grid';
import { Button } from '@twilio-paste/core/button';
import { CallOutgoingIcon } from '@twilio-paste/icons/esm/CallOutgoingIcon';
import { Contact } from '../types';

export interface ContactTableProps {
  contacts: Contact[];
  onPhoneClick: (phoneNumber: string, contactName: string) => void;
}

const ContactTable: React.FC<ContactTableProps> = ({ contacts, onPhoneClick }) => {
  if (contacts.length === 0) {
    return <p>No contacts to display</p>;
  }

  return (
    <DataGrid aria-label="Contacts table">
      <DataGridHead>
        <DataGridRow>
          <DataGridCell as="th">Name</DataGridCell>
          <DataGridCell as="th">Phone Number</DataGridCell>
          <DataGridCell as="th">Company</DataGridCell>
          <DataGridCell as="th">Action</DataGridCell>
        </DataGridRow>
      </DataGridHead>
      <DataGridBody>
        {contacts.map((contact) => (
          <DataGridRow key={contact.id}>
            <DataGridCell>{contact.name}</DataGridCell>
            <DataGridCell>{contact.phoneNumber}</DataGridCell>
            <DataGridCell>{contact.company}</DataGridCell>
            <DataGridCell>
              <Button variant="secondary" size="small" onClick={() => onPhoneClick(contact.phoneNumber, contact.name)}>
                <CallOutgoingIcon decorative={false} title={`Call ${contact.name}`} />
              </Button>
            </DataGridCell>
          </DataGridRow>
        ))}
      </DataGridBody>
    </DataGrid>
  );
};

export default ContactTable;
