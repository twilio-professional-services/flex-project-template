import React, { useState } from 'react';
import { Manager, useFlexSelector } from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import { Heading } from '@twilio-paste/core/heading';
import { Button } from '@twilio-paste/core/button';
import { Separator } from '@twilio-paste/core/separator';
import { useUID } from '@twilio-paste/core/uid-library';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { CallOutgoingIcon } from '@twilio-paste/icons/esm/CallOutgoingIcon';
import { Card } from '@twilio-paste/core/card';
import { HelpText } from '@twilio-paste/core/help-text';
import { Stack } from '@twilio-paste/core/stack';
import { AgentIcon } from '@twilio-paste/icons/esm/AgentIcon';
import { CallIcon } from '@twilio-paste/icons/esm/CallIcon';
import { Alert } from '@twilio-paste/core/alert';
import { Flex } from '@twilio-paste/core/flex';

import { Contact } from '../types';
import { CustomWorkerAttributes } from '../../../types/task-router/Worker';
import logger from '../../../utils/logger';

interface OutboundCallModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (phoneNumber: string) => Promise<void>;
}

const OutboundCallModal: React.FC<OutboundCallModalProps> = ({ contact, isOpen, onClose, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalHeadingID = useUID();

  const { selectedCallerId } = Manager.getInstance().workerClient?.attributes as CustomWorkerAttributes;

  const handleConfirm = async () => {
    if (!contact) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onConfirm(contact.phoneNumber);
    } catch (err: any) {
      logger.error('[address-book] Error calling contact', {
        contact: contact.id,
        error: err?.message || err,
      });
      setError(err?.message || 'Failed to initiate call. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!contact) {
    return null;
  }

  return (
    <Modal ariaLabelledby={modalHeadingID} isOpen={isOpen} onDismiss={handleClose} size="default">
      <ModalHeader>
        <ModalHeading as="h3" id={modalHeadingID}>
          Call Contact
        </ModalHeading>
      </ModalHeader>
      <ModalBody>
        {error && (
          <Box marginBottom="space30">
            <Alert variant="error">{error}</Alert>
          </Box>
        )}

        <Card>
          <Stack orientation="vertical" spacing="space60">
            {/* Contact Name */}
            <Stack orientation="horizontal" spacing="space0">
              <Flex>
                <Box paddingRight="space50">
                  <Heading as="h4" variant="heading40" marginBottom="space0" color="colorTextIcon">
                    👤
                  </Heading>
                </Box>
              </Flex>
              <Flex vertical>
                <Heading as="h3" variant="heading30" marginBottom="space0">
                  {contact.name}
                </Heading>
                <HelpText marginTop="space0">Contact Name</HelpText>
              </Flex>
            </Stack>

            <Separator orientation="horizontal" verticalSpacing="space50" />

            {/* Phone Number to Dial */}
            <Stack orientation="horizontal" spacing="space0">
              <Flex>
                <Box paddingRight="space50">
                  <CallIcon decorative size="sizeIcon50" color="colorTextIconNeutral" />
                </Box>
              </Flex>
              <Flex vertical>
                <Heading as="h3" variant="heading30" marginBottom="space0">
                  {contact.phoneNumber}
                </Heading>
                <HelpText marginTop="space0">Outbound Number to Dial</HelpText>
              </Flex>
            </Stack>

            {/* Caller ID (if available) */}
            {selectedCallerId && (
              <>
                <Separator orientation="horizontal" verticalSpacing="space50" />
                <Stack orientation="horizontal" spacing="space0">
                  <Flex>
                    <Box paddingRight="space50">
                      <AgentIcon decorative size="sizeIcon50" color="colorTextIconNeutral" />
                    </Box>
                  </Flex>
                  <Flex vertical>
                    <Heading as="h5" variant="heading50" marginBottom="space0">
                      {selectedCallerId}
                    </Heading>
                    <HelpText marginTop="space0">Caller ID</HelpText>
                  </Flex>
                </Stack>
              </>
            )}

            {/* Company (if available) */}
            {contact.company && (
              <>
                <Separator orientation="horizontal" verticalSpacing="space50" />
                <Stack orientation="horizontal" spacing="space0">
                  <Flex>
                    <Box paddingRight="space50">
                      <Heading as="h4" variant="heading40" marginBottom="space0" color="colorTextIcon">
                        🏢
                      </Heading>
                    </Box>
                  </Flex>
                  <Flex vertical>
                    <Heading as="h5" variant="heading50" marginBottom="space0">
                      {contact.company}
                    </Heading>
                    <HelpText marginTop="space0">Company</HelpText>
                  </Flex>
                </Stack>
              </>
            )}
          </Stack>
        </Card>
      </ModalBody>
      <ModalFooter>
        <ModalFooterActions>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={isLoading || !contact.phoneNumber}>
            <CallOutgoingIcon decorative />
            {isLoading ? 'Calling...' : 'Call'}
          </Button>
        </ModalFooterActions>
      </ModalFooter>
    </Modal>
  );
};

export default OutboundCallModal;
