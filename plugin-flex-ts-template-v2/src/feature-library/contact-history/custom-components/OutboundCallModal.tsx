import { useState } from 'react';
import { Actions, Template, templates } from '@twilio/flex-ui';
import { Flex } from '@twilio-paste/core/flex';
import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { useUID } from '@twilio-paste/core/uid-library';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { CallOutgoingIcon } from '@twilio-paste/icons/esm/CallOutgoingIcon';

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
          <Template source={templates[StringTemplates.OutboundCallDialog]} />: {phoneNumber}
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
