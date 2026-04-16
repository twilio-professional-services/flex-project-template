/**
 * Customer Display Service
 * Handles API calls to fetch customer data from Salesforce
 */

import { CustomerData } from '../types';

export class CustomerDisplayService {
  static async fetchCustomerDetails(phoneNumber: string): Promise<CustomerData | null> {
    if (!phoneNumber) {
      console.warn('[customer-display] Phone number is missing or invalid');
      throw new Error('Phone number is required');
    }

    try {
      console.log('[customer-display] Fetching customer details for phone:', phoneNumber);

      const response = await fetch('https://hello-messaging-4461-6yaplh.twil.io/sf-customer-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `phone=${encodeURIComponent(phoneNumber)}`,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // API returns empty array [] for no record found
      if (Array.isArray(data) && data.length === 0) {
        console.log('[customer-display] No customer record found for phone:', phoneNumber);
        return null;
      }

      // API returns array with customer data [{ ... }]
      if (Array.isArray(data) && data.length > 0) {
        const customerData = data[0] as CustomerData;
        console.log('[customer-display] Successfully fetched customer data:', customerData);
        return customerData;
      }

      // If response is not in expected format, treat as no record
      console.warn('[customer-display] Unexpected API response format:', data);
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('[customer-display] Error fetching customer details:', errorMessage);
      throw new Error(`Failed to load customer details: ${errorMessage}`);
    }
  }
}
