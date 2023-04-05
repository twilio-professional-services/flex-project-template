import { Flex as FlexBox, Box, Button } from '@twilio-paste/core';
import { ChatIcon } from '@twilio-paste/icons/esm/ChatIcon';
import { AgentIcon } from '@twilio-paste/icons/esm/AgentIcon';
import { CloseIcon } from '@twilio-paste/icons/esm/CloseIcon';
import { useState } from 'react';

import { ParticipantInviteType } from '../../../../types/ParticipantInvite';

interface InvitedParticipantProps {
  participantName: string;
  inviteTargetType: ParticipantInviteType;
  handleCancelInvite: () => void;
}

export const InvitedParticipant = ({
  participantName,
  inviteTargetType,
  handleCancelInvite,
}: InvitedParticipantProps) => {
  const [cancelHandled, setCancelHandled] = useState(false);

  const handleCancel = () => {
    setCancelHandled(true);
    handleCancelInvite();
  };

  const icon =
    inviteTargetType === 'Worker' ? (
      <AgentIcon decorative={false} title={`Agent - ${participantName}`} />
    ) : (
      <ChatIcon decorative title={`Queue - ${participantName}`} />
    );

  return (
    <FlexBox>
      <FlexBox>
        <Box padding="space20">{icon}</Box>
      </FlexBox>
      <FlexBox grow>
        <Box padding="space20" width="100%">
          {participantName}
        </Box>
      </FlexBox>
      <FlexBox>
        <Box padding="space20">
          <Button variant="secondary" size="icon" disabled={cancelHandled} onClick={handleCancel}>
            <CloseIcon decorative title={`Cancel invite to ${participantName}`} />
          </Button>
        </Box>
      </FlexBox>
    </FlexBox>
  );
};
