import React, { useEffect, useState } from 'react';
import { Box } from '@twilio-paste/core/box';
import { Heading } from '@twilio-paste/core/heading';
import { Spinner } from '@twilio-paste/core/spinner';

import { Contact } from '../types';
import { loadAndParseCSV } from '../utils';
import { PAGE_SIZE } from '../config';
import SearchBar from './SearchBar';
import ContactTable from './ContactTable';
import Paginator from './Paginator';

const AddressBookView: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load CSV on component mount
  useEffect(() => {
    const loadContacts = async () => {
      setLoading(true);
      setError(null);

      try {
        const loadedContacts = await loadAndParseCSV();

        if (loadedContacts.length === 0) {
          setError('Failed to load contacts. The CSV file may be unavailable.');
        }

        setContacts(loadedContacts);
        setCurrentPage(1); // Reset to first page after loading
      } catch (err) {
        console.error('Error loading contacts:', err);
        setError('An error occurred while loading contacts.');
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(contacts.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentPageContacts = contacts.slice(startIndex, endIndex);

  // Handle phone click
  const handlePhoneClick = (phoneNumber: string, contactName: string) => {
    console.log(`Dialing contact: ${phoneNumber}`);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // Reset to first page when search changes (filtering logic deferred)
    setCurrentPage(1);
  };

  return (
    <Box padding="space30">
      <Heading as="h2" variant="heading20" marginBottom="space0">
        Address Book
      </Heading>

      {loading && (
        <Box display="flex" justifyContent="center" padding="space40">
          <Spinner decorative={false} title="Loading contacts..." />
        </Box>
      )}

      {error && (
        <Box
          backgroundColor="colorBackgroundErrorWeakest"
          borderColor="colorBorderError"
          borderWidth="borderWidth10"
          borderStyle="solid"
          padding="space20"
          marginBottom="space20"
        >
          <p>{error}</p>
        </Box>
      )}

      {!loading && !error && (
        <>
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
          <ContactTable contacts={currentPageContacts} onPhoneClick={handlePhoneClick} />
          <Box marginTop="space20">
            <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default AddressBookView;
