/**
 * ConnieRTC Enhanced CRM Container
 * 
 * This component displays customer information in the Flex UI when calls arrive.
 * It integrates with the lookup-customer serverless function to show real-time data.
 */

import React, { useState, useEffect } from 'react';
import { Box, Text, Spinner, Card } from '@twilio-paste/core';
import { useFlexSelector } from '@twilio/flex-ui';

const EnhancedCRMContainer = () => {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get task data from Flex state
  const task = useFlexSelector(state => {
    const { selectedTaskSid } = state.flex.view;
    return selectedTaskSid ? state.flex.tasks.get(selectedTaskSid) : null;
  });

  useEffect(() => {
    if (task && task.attributes) {
      // Check if customer data is already in task attributes
      if (task.attributes.customer_found && task.attributes.customer) {
        setCustomerData(task.attributes.customer);
      } else if (task.attributes.profile_url) {
        // Customer data available via profile URL
        displayProfileUrl(task.attributes.profile_url);
      } else {
        // Fallback: show basic task info
        displayBasicInfo(task);
      }
    }
  }, [task]);

  const displayProfileUrl = (profileUrl) => {
    // In a real implementation, this would display the profile URL in an iframe
    setCustomerData({
      display_type: 'profile_url',
      profile_url: profileUrl,
      message: 'Customer profile loaded'
    });
  };

  const displayBasicInfo = (task) => {
    setCustomerData({
      display_type: 'basic',
      caller_id: task.attributes.name || task.attributes.from || 'Unknown',
      phone: task.attributes.from,
      message: 'No customer data available'
    });
  };

  if (loading) {
    return (
      <Box padding="space60" textAlign="center">
        <Spinner decorative={false} title="Loading customer data..." />
        <Text as="p" marginTop="space30">Loading customer information...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box padding="space60">
        <Card>
          <Text as="h3" fontSize="fontSize30" color="colorTextError">
            Error Loading Customer Data
          </Text>
          <Text as="p" marginTop="space30">{error}</Text>
        </Card>
      </Box>
    );
  }

  if (!customerData) {
    return (
      <Box padding="space60" textAlign="center">
        <Text as="p">No active task selected</Text>
      </Box>
    );
  }

  // Display customer data based on type
  if (customerData.display_type === 'profile_url') {
    return (
      <Box height="100%">
        <iframe
          src={customerData.profile_url}
          width="100%"
          height="100%"
          frameBorder="0"
          title="Customer Profile"
          style={{ minHeight: '400px' }}
        />
      </Box>
    );
  }

  // Display structured customer data
  return (
    <Box padding="space60">
      <Card>
        <Text as="h3" fontSize="fontSize40" marginBottom="space40">
          📞 Customer Information
        </Text>
        
        {customerData.first_name && customerData.last_name ? (
          <>
            <Box marginBottom="space30">
              <Text as="p" fontWeight="fontWeightSemibold">
                👤 {customerData.first_name} {customerData.last_name}
              </Text>
            </Box>
            
            {customerData.email && (
              <Box marginBottom="space30">
                <Text as="p">📧 {customerData.email}</Text>
              </Box>
            )}
            
            {customerData.programs && (
              <Box marginBottom="space30">
                <Text as="p">🏷️ Programs: {customerData.programs}</Text>
              </Box>
            )}
            
            {customerData.notes && (
              <Box marginBottom="space30">
                <Text as="p">📝 Notes: {customerData.notes}</Text>
              </Box>
            )}
            
            {customerData.last_visit && (
              <Box marginBottom="space30">
                <Text as="p">📅 Last Visit: {customerData.last_visit}</Text>
              </Box>
            )}
          </>
        ) : (
          <Box>
            <Text as="p">📞 {customerData.caller_id || 'Unknown Caller'}</Text>
            <Text as="p" marginTop="space20">
              {customerData.phone && `Phone: ${customerData.phone}`}
            </Text>
            <Text as="p" marginTop="space20" fontStyle="italic">
              {customerData.message}
            </Text>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default EnhancedCRMContainer;
