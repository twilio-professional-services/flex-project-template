import React, { useState } from 'react';
import { DataGrid, DataGridHead, DataGridBody, DataGridRow, DataGridCell } from '@twilio-paste/core/data-grid';
import { Button } from '@twilio-paste/core/button';
import { CallOutgoingIcon } from '@twilio-paste/icons/esm/CallOutgoingIcon';
import { Box } from '@twilio-paste/core/box';
import { Tooltip } from '@twilio-paste/core/tooltip';

import { Contact } from '../types';
import OutboundCallModal from './OutboundCallModal';
import { isValidE164PhoneNumber, formatPhoneNumberToE164, invokeOutboundCall } from '../utils/OutboundCallService';
import logger from '../../../utils/logger';

export interface ContactTableProps {
  contacts: Contact[];
}

const ContactTable: React.FC<ContactTableProps> = ({ contacts }) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showOutboundModal, setShowOutboundModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleDialClick = (contact: Contact) => {
    // Validate phone number format
    const isValid = isValidE164PhoneNumber(contact.phoneNumber);
    const canBeFormatted = isValid || formatPhoneNumberToE164(contact.phoneNumber) !== null;

    if (!canBeFormatted) {
      setValidationError(`Invalid phone number format: ${contact.phoneNumber}`);
      setSelectedContact(contact);
      logger.warn('[address-book] Invalid phone number', { contact: contact.id, phoneNumber: contact.phoneNumber });
      return;
    }

    // Clear error and open modal with contact
    setValidationError(null);
    setSelectedContact(contact);
    setShowOutboundModal(true);
  };

  const handleCallConfirm = async (phoneNumber: string) => {
    try {
      await invokeOutboundCall(phoneNumber);
      setShowOutboundModal(false);
      setSelectedContact(null);
    } catch (error: any) {
      logger.error('[address-book] Call invocation failed', error);
      throw error;
    }
  };

  const handleCloseModal = () => {
    setShowOutboundModal(false);
    setSelectedContact(null);
    setValidationError(null);
  };

  if (contacts.length === 0) {
    return <p>No contacts to display</p>;
  }

  return (
    <>
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
                <Tooltip
                  text={
                    validationError && selectedContact?.id === contact.id ? validationError : `Call ${contact.name}`
                  }
                  placement="left"
                >
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleDialClick(contact)}
                    title={`Call ${contact.name}`}
                  >
                    <CallOutgoingIcon decorative={false} title={`Call ${contact.name}`} />
                  </Button>
                </Tooltip>
              </DataGridCell>
            </DataGridRow>
          ))}
        </DataGridBody>
      </DataGrid>

      <OutboundCallModal
        contact={selectedContact}
        isOpen={showOutboundModal}
        onClose={handleCloseModal}
        onConfirm={handleCallConfirm}
      />
    </>
  );
};

export default ContactTable;
