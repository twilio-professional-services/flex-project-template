import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ITask } from '@twilio/flex-ui';
import { Box, Button, Heading, Paragraph, Spinner } from '@twilio-paste/core';
import { styled } from '@twilio-paste/styling-library';
import { CustomerData } from '../types';
import { CustomerDisplayService } from '../utils/CustomerDisplayService';
import { reduxNamespace } from '../../../utils/state';

interface Props {}

interface CustomerDisplayState {
  data: CustomerData | null;
  loading: boolean;
  error: string | null;
  noRecordFound: boolean;
}

const CustomerDisplayContainer = styled(Box)`
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  margin-top: 20px;
`;

const FieldRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const FieldLabel = styled.span`
  font-weight: 600;
  min-width: 180px;
  flex-shrink: 0;
`;

const FieldValue = styled.span`
  flex-grow: 1;
  text-align: right;
`;

const ErrorBox = styled(Box)`
  background-color: #fce4e4;
  border-left: 4px solid #f44336;
  padding: 15px;
  border-radius: 4px;
  display: flex;
  gap: 10px;
`;

const NoRecordBox = styled(Box)`
  background-color: #f5f5f5;
  border-left: 4px solid #9e9e9e;
  padding: 15px;
  border-radius: 4px;
  text-align: center;
`;

const SuccessBox = styled(Box)`
  background-color: #f9f9f9;
  border-left: 4px solid #4caf50;
  padding: 15px;
  border-radius: 4px;
`;

const CustomerDisplayPanel: React.FC<Props> = () => {
  // Read current task from Redux state
  const currentTask = useSelector((state: any) => state[reduxNamespace]?.customerDisplay?.currentTask as ITask | null);

  const [state, setState] = useState<CustomerDisplayState>({
    data: null,
    loading: false,
    error: null,
    noRecordFound: false,
  });

  const previousTaskSidRef = React.useRef<string | null>(null);

  const fetchCustomerData = async () => {
    if (!currentTask?.attributes) {
      console.warn('[customer-display] Task or task attributes missing');
      return;
    }

    // Extract phone number from task attributes
    // The field might be 'from', 'callerPhone', 'phoneNumber', etc.
    // Defaulting to 'from' which is common in Flex
    const phoneNumber =
      currentTask.attributes.from || currentTask.attributes.callerPhone || currentTask.attributes.phoneNumber;

    if (!phoneNumber) {
      console.warn('[customer-display] Phone number not found in task attributes');
      setState({
        data: null,
        loading: false,
        error: 'Phone number not available',
        noRecordFound: false,
      });
      return;
    }

    try {
      setState({ data: null, loading: true, error: null, noRecordFound: false });

      const customerData = await CustomerDisplayService.fetchCustomerDetails(phoneNumber);

      if (customerData === null) {
        setState({
          data: null,
          loading: false,
          error: null,
          noRecordFound: true,
        });
      } else {
        setState({
          data: customerData,
          loading: false,
          error: null,
          noRecordFound: false,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        noRecordFound: false,
      });
    }
  };

  // Fetch customer data when task changes (based on taskSid)
  useEffect(() => {
    if (currentTask?.taskSid && previousTaskSidRef.current !== currentTask.taskSid) {
      previousTaskSidRef.current = currentTask.taskSid;
      fetchCustomerData();
    }
  }, [currentTask?.taskSid]);

  const { data, loading, error, noRecordFound } = state;

  // Only show if we have a current task from Redux state
  if (!currentTask) {
    return null;
  }

  return (
    <CustomerDisplayContainer>
      <Heading as="h3" variant="heading40">
        Customer Details
      </Heading>

      {/* Loading State */}
      {loading && (
        <Box marginTop="space40" display="flex" flexDirection="column" alignItems="center">
          <Spinner decorative={false} title="Loading" size="sizeIcon60" />
          <Paragraph>Loading customer details...</Paragraph>
        </Box>
      )}

      {/* Error State */}
      {!loading && error && (
        <ErrorBox marginTop="space30">
          <Box>
            <Paragraph marginBottom="space0">
              <strong>Failed to load customer details</strong>
            </Paragraph>
            <Paragraph marginBottom="space0" color="colorTextError">
              {error}
            </Paragraph>
            <Button variant="secondary" size="small" onClick={fetchCustomerData}>
              Retry
            </Button>
          </Box>
        </ErrorBox>
      )}

      {/* No Record Found State */}
      {!loading && !error && noRecordFound && (
        <NoRecordBox marginTop="space30">
          <Paragraph>
            <strong>No customer record found</strong>
          </Paragraph>
        </NoRecordBox>
      )}

      {/* Success State */}
      {!loading && !error && !noRecordFound && data && (
        <SuccessBox marginTop="space30">
          <FieldRow>
            <FieldLabel>Full Name</FieldLabel>
            <FieldValue>{data.fullName}</FieldValue>
          </FieldRow>
          <FieldRow>
            <FieldLabel>Account Name</FieldLabel>
            <FieldValue>{data.accountName}</FieldValue>
          </FieldRow>
          <FieldRow>
            <FieldLabel>Last Interaction Date</FieldLabel>
            <FieldValue>{data.lastInteractionDate}</FieldValue>
          </FieldRow>
          <FieldRow>
            <FieldLabel>Open Cases</FieldLabel>
            <FieldValue>{data.openCasesCount}</FieldValue>
          </FieldRow>
        </SuccessBox>
      )}
    </CustomerDisplayContainer>
  );
};

export default CustomerDisplayPanel;
