import { useState } from 'react';
import { Manager, Actions, Template, templates } from '@twilio/flex-ui';
import { Flex } from '@twilio-paste/core/flex';
import { Box } from '@twilio-paste/core/box';
import { Heading } from '@twilio-paste/core/heading';
import { Text } from '@twilio-paste/core/text';
import { Button } from '@twilio-paste/core/button';
import { Separator } from '@twilio-paste/core/separator';
import { useUID } from '@twilio-paste/core/uid-library';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { CallOutgoingIcon } from '@twilio-paste/icons/esm/CallOutgoingIcon';

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
            <Flex>
              <Box paddingRight="space30">
                <CallOutgoingIcon size="sizeIcon50" decorative={true} />
              </Box>
              <Box>
                <Template source={templates.OutboundCallAriaLabel} />
              </Box>
            </Flex>
          </ModalHeading>
        </ModalHeader>
        <ModalBody>
          <Flex>
            <Text as="p">
              <Template source={templates[StringTemplates.OutboundCallDialog]} />:
            </Text>
          </Flex>
          <Flex>
            <Heading as="h3" variant="heading30">
              {phoneNumber}
            </Heading>
          </Flex>
          <Separator orientation="horizontal" verticalSpacing="space50" />
          <Flex>
            <Text as="p">
              <Template source={templates[StringTemplates.OutboundCallerId]} />:
            </Text>
          </Flex>
          <Flex>
            <Text as="p">{selectedCallerId}</Text>
          </Flex>
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
              <Template source={templates.OutboundCallAriaLabel} />
            </Button>
          </ModalFooterActions>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default OutboundCallModal;
