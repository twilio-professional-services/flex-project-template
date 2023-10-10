import { Stack } from '@twilio-paste/core/stack';
import { Card } from '@twilio-paste/core/card';
import { Heading } from '@twilio-paste/core/heading';
import { Template, templates } from '@twilio/flex-ui';

import { InvitedParticipant } from './InvitedParticipant/InvitedParticipant';
import { InvitedParticipantDetails } from '../../../types/InvitedParticipantDetails';
import { StringTemplates } from '../../../flex-hooks/strings/ChatTransferStrings';

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
        key={invitedParticipantDetail.invitesTaskSid}
        inviteTargetType={inviteTargetType}
        handleCancelInvite={() => handleCancelInvite(invitedParticipantDetail)}
      />
    );
  });

  return (
    <Card padding="space60">
      <Heading as="h2" variant="heading20">
        <Template source={templates[StringTemplates.InvitedParticipants]} />
      </Heading>
      <Stack orientation="vertical" spacing="space20">
        {invitedParticipants}
      </Stack>
    </Card>
  );
};
