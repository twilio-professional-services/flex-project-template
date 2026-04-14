import Papa from 'papaparse';
import { Contact } from '../types';

export const parseCSV = (csvString: string): Contact[] => {
  const result = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length) {
    console.error('Error parsing CSV:', result.errors);
    return [];
  }

  return result.data as Contact[];
};

/**
 * Loads and parses the contacts CSV file from the public assets folder
 * @returns Promise resolving to array of Contact objects
 */
export const loadAndParseCSV = async (): Promise<Contact[]> => {
  try {
    // Try to fetch from /address-book-contacts.csv which is in the public folder
    const response = await fetch('/address-book-contacts.csv');

    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.statusText}`);
    }

    const csvString = await response.text();
    return parseCSV(csvString);
  } catch (error) {
    console.error('Error loading and parsing CSV:', error);
    return [];
  }
};
