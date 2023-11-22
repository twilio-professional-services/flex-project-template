import { useState } from 'react';
import { Manager, Actions, Template, templates } from '@twilio/flex-ui';
import { Flex } from '@twilio-paste/core/flex';
import { Heading } from '@twilio-paste/core/heading';
import { Text } from '@twilio-paste/core/text';
import { Button } from '@twilio-paste/core/button';
import { Separator } from '@twilio-paste/core/separator';
import { useUID } from '@twilio-paste/core/uid-library';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { CallOutgoingIcon } from '@twilio-paste/icons/esm/CallOutgoingIcon';
import { Card } from '@twilio-paste/core/card';
import { HelpText } from '@twilio-paste/core/help-text';
import { Stack } from '@twilio-paste/core/stack';
import { AgentIcon } from '@twilio-paste/icons/esm/AgentIcon';

import { CustomWorkerAttributes } from '../../../types/task-router/Worker';
import { StringTemplates } from '../flex-hooks/strings';

const placeOutboundCall = async (destination: string) => {
  Actions.invokeAction('StartOutboundCall', {
    destination,
  });
};

interface Props {
  phoneNumber: string;
}

const OutboundCallModal = ({ phoneNumber }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const modalHeadingID = useUID();

  const { selectedCallerId } = Manager.getInstance().workerClient?.attributes as CustomWorkerAttributes;

  return (
    <div>
      <Button
        variant="link"
        size="small"
        title="Click to Call"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {phoneNumber}
      </Button>

      <Modal ariaLabelledby={modalHeadingID} isOpen={isOpen} onDismiss={handleClose} size="default">
        <ModalHeader>
          <ModalHeading as="h3" id={modalHeadingID}>
            <Template source={templates[StringTemplates.ContactOutboundCall]} />
          </ModalHeading>
        </ModalHeader>
        <ModalBody>
          <Card>
            <Stack orientation="vertical" spacing="space60">
              <Stack orientation="vertical" spacing="space0">
                <Heading as="h3" variant="heading30" marginBottom="space0">
                  <Flex vAlignContent="center" hAlignContent="left">
                    <CallOutgoingIcon decorative size="sizeIcon50" color="colorTextIconNeutral" />
                    <Text as="p" fontSize="fontSize40" fontWeight="fontWeightExtrabold">
                      {phoneNumber}
                    </Text>
                  </Flex>
                </Heading>
                <HelpText marginTop="space0">
                  <Template source={templates[StringTemplates.ContactCustomerPhoneNumber]} />
                </HelpText>
              </Stack>
              <Separator orientation="horizontal" verticalSpacing="space50" />
              <Stack orientation="vertical" spacing="space0">
                <Heading as="h3" variant="heading30" marginBottom="space0">
                  <Flex vAlignContent="center" hAlignContent="left">
                    <AgentIcon decorative size="sizeIcon50" color="colorTextIconNeutral" />
                    <Text as="p" fontSize="fontSize30">
                      {selectedCallerId}
                    </Text>
                  </Flex>
                </Heading>
                <HelpText marginTop="space0">
                  <Template source={templates[StringTemplates.OutboundCallerId]} />
                </HelpText>
              </Stack>
            </Stack>
          </Card>
        </ModalBody>
        <ModalFooter>
          <ModalFooterActions>
            <Button variant="secondary" onClick={handleClose}>
              <Template source={templates.Cancel} />
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                placeOutboundCall(phoneNumber);
              }}
              disabled={!phoneNumber}
            >
              <CallOutgoingIcon decorative />
              <Template source={templates.OutboundCallAriaLabel} />
            </Button>
          </ModalFooterActions>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default OutboundCallModal;
