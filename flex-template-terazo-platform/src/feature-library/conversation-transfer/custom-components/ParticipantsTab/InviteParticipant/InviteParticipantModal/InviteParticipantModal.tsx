import { useState } from 'react';
import { useUID } from '@twilio-paste/core/dist/uid-library';
import {
  Button,
  Box,
  Modal,
  ModalHeader,
  ModalHeading,
  ModalBody,
  ModalFooter,
  ModalFooterActions,
} from '@twilio-paste/core';

import { SelectWorkerToInvite } from './SelectParticipant/SelectWorkerToInvite';
import { SelectQueueToInvite } from './SelectParticipant/SelectQueueToInvite';
import { ParticipantInvite, ParticipantInviteType } from '../../../../types/ParticipantInvite';

interface InviteParticipantModalProps {
  participantModalType: ParticipantInviteType;
  handleClose: () => void;
  handleInviteParticipantClicked: (invitedParticipant: ParticipantInvite) => any;
}
export const InviteParticipantModal = ({
  participantModalType,
  handleClose,
  handleInviteParticipantClicked,
}: InviteParticipantModalProps) => {
  const modalHeadingID = useUID();
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantInvite | null>(null);
  const isOpen = Boolean(participantModalType);

  let heading = '';
  let inviteButtonText = '';
  let participantSelecter = null;

  if (participantModalType === 'Worker') {
    heading = 'Invite a Specific Agent';
    inviteButtonText = 'Invite Agent';
    participantSelecter = <SelectWorkerToInvite updateSelectedParticipant={setSelectedParticipant} />;
  } else {
    heading = 'Send an Invite to a Queue';
    inviteButtonText = 'Invite to Queue';
    participantSelecter = <SelectQueueToInvite updateSelectedParticipant={setSelectedParticipant} />;
  }
  // Note the temp hack with two Boxes :)
  // Worksaround this issue: https://github.com/twilio-labs/paste/issues/2630
  // Should be able to remove once next release of Flex is out and uses latest version Paste (Oct-22)
  return (
    <div>
      <Modal ariaLabelledby={modalHeadingID} isOpen={isOpen} onDismiss={handleClose} size="default">
        <ModalHeader>
          <ModalHeading as="h3" id={modalHeadingID}>
            {heading}
          </ModalHeading>
        </ModalHeader>
        <ModalBody>
          {participantSelecter}

          <Box paddingTop="space200" paddingBottom="space200" />
          <Box paddingTop="space200" paddingBottom="space200" />
        </ModalBody>
        <ModalFooter>
          <ModalFooterActions>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!selectedParticipant}
              onClick={() => {
                if (selectedParticipant) handleInviteParticipantClicked(selectedParticipant);
              }}
            >
              {inviteButtonText}
            </Button>
          </ModalFooterActions>
        </ModalFooter>
      </Modal>
    </div>
  );
};
