import { useState } from 'react';
import { Stack, Card, Heading, Button, Box } from '@twilio-paste/core';
import { AgentIcon } from '@twilio-paste/icons/esm/AgentIcon';
import { ChatIcon } from '@twilio-paste/icons/esm/ChatIcon';
import { Actions, ITask } from '@twilio/flex-ui';

import { InviteParticipantModal } from './InviteParticipantModal/InviteParticipantModal';
import {
  ParticipantInvite,
  ParticipantInviteType,
  QueueParticipantInvite,
  WorkerParticipantInvite,
} from '../../../types/ParticipantInvite';
import { TransferActionPayload } from '../../../types/ActionPayloads';

interface InviteParticipantProps {
  task: ITask;
  disableNewInvites: boolean;
}
export const InviteParticipant = ({ task, disableNewInvites }: InviteParticipantProps) => {
  const [participantModalType, setParticipantInviteModalType] = useState<ParticipantInviteType | null>(null);

  const handleOpenModal = (type: ParticipantInviteType): any => setParticipantInviteModalType(type);
  const handleCloseModal = () => setParticipantInviteModalType(null);

  const handleInviteParticipantClicked = (invitedParticipantDetails: ParticipantInvite) => {
    console.log('handleInviteParticipantClicked', invitedParticipantDetails);

    const targetSid =
      invitedParticipantDetails.type === 'Queue'
        ? (invitedParticipantDetails.participant as QueueParticipantInvite).queue_sid
        : (invitedParticipantDetails.participant as WorkerParticipantInvite).worker_sid;

    const chatTransferPayload: TransferActionPayload = { task, targetSid, options: { mode: 'WARM' } };
    Actions.invokeAction('ChatTransferTask', chatTransferPayload);

    handleCloseModal();
  };

  return (
    <>
      <Card padding="space60">
        <Heading as="h2" variant="heading20">
          Invite a Participant
        </Heading>

        <Stack orientation="horizontal" spacing="space30">
          <Box paddingTop="space20">
            <Button variant="primary" onClick={() => handleOpenModal('Worker')} disabled={disableNewInvites}>
              <AgentIcon decorative /> Invite Specific Agent
            </Button>
          </Box>
          <Box paddingTop="space20">
            <Button variant="primary" onClick={() => handleOpenModal('Queue')} disabled={disableNewInvites}>
              <ChatIcon decorative /> Invite from Queue
            </Button>
          </Box>
        </Stack>
      </Card>

      {participantModalType !== null && (
        <InviteParticipantModal
          participantModalType={participantModalType}
          handleClose={handleCloseModal}
          handleInviteParticipantClicked={handleInviteParticipantClicked}
        />
      )}
    </>
  );
};
