import { Stack, Card, Heading } from '@twilio-paste/core';

import { InvitedParticipant } from './InvitedParticipant/InvitedParticipant';
import { InvitedParticipantDetails } from '../../../types/InvitedParticipantDetails';

interface InvitedParticipantsProps {
  invitedParticipantDetails: InvitedParticipantDetails[];
  handleCancelInvite: (invitedParticipantDetails: InvitedParticipantDetails) => void;
}

export const InvitedParticipants = ({ invitedParticipantDetails, handleCancelInvite }: InvitedParticipantsProps) => {
  const invitedParticipants = invitedParticipantDetails.map((invitedParticipantDetail) => {
    const participantName = invitedParticipantDetail.targetName;
    const { inviteTargetType } = invitedParticipantDetail;
    return (
      <InvitedParticipant
        participantName={participantName}
        inviteTargetType={inviteTargetType}
        handleCancelInvite={() => handleCancelInvite(invitedParticipantDetail)}
      />
    );
  });

  return (
    <Card padding="space60">
      <Heading as="h2" variant="heading20">
        Invited Participants
      </Heading>
      <Stack orientation="vertical" spacing="space20">
        {invitedParticipants}
      </Stack>
    </Card>
  );
};
