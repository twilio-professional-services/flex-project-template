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
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
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
        setFilteredContacts(loadedContacts);
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

  // Filter contacts based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredContacts(contacts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = contacts.filter((contact) => {
        return (
          contact.name.toLowerCase().includes(query) ||
          contact.phoneNumber.toLowerCase().includes(query) ||
          contact.company.toLowerCase().includes(query)
        );
      });
      setFilteredContacts(filtered);
    }

    // Reset to first page when search results change
    setCurrentPage(1);
  }, [searchQuery, contacts]);

  // Calculate pagination based on filtered results
  const totalPages = Math.ceil(filteredContacts.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentPageContacts = filteredContacts.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {currentPageContacts.length === 0 && filteredContacts.length === 0 && searchQuery.trim() ? (
            <Box
              backgroundColor="colorBackgroundNeutralWeakest"
              borderColor="colorBorderNeutral"
              borderWidth="borderWidth10"
              borderStyle="solid"
              padding="space20"
              marginBottom="space20"
              textAlign="center"
            >
              <p>No contacts found matching "{searchQuery}"</p>
            </Box>
          ) : (
            <>
              <ContactTable contacts={currentPageContacts} />
              <Box marginTop="space20">
                <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default AddressBookView;
