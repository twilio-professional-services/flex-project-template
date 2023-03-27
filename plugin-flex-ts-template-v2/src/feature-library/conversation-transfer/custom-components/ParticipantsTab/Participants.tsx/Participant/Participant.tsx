import { Flex as FlexBox, Box, Button } from '@twilio-paste/core';
import { UserIcon } from '@twilio-paste/icons/esm/UserIcon';
import { AgentIcon } from '@twilio-paste/icons/esm/AgentIcon';
import { CloseIcon } from '@twilio-paste/icons/esm/CloseIcon';
import { useState } from 'react';

import { ParticipantType } from '../../../../types/ParticipantDetails';

interface ParticipantProps {
  name: string;
  allowKick: boolean;
  participantType: ParticipantType;
  handleKickParticiant: () => void;
}

export const Participant = ({ participantType, name, allowKick, handleKickParticiant }: ParticipantProps) => {
  const [kickHandled, setKickHandled] = useState(false);

  const handleKick = () => {
    setKickHandled(true);
    handleKickParticiant();
  };

  const icon =
    participantType === 'agent' ? (
      <AgentIcon decorative={false} title={`Agent - ${name}`} />
    ) : (
      <UserIcon decorative title={`Customer - ${name}`} />
    );

  const disableKickParticipant = !allowKick;

  return (
    <FlexBox>
      <FlexBox>
        <Box padding="space20">{icon}</Box>
      </FlexBox>
      <FlexBox grow>
        <Box padding="space20" width="100%">
          {name}
        </Box>
      </FlexBox>
      <FlexBox>
        <Box padding="space20">
          <Button variant="secondary" size="icon" disabled={kickHandled || disableKickParticipant} onClick={handleKick}>
            <CloseIcon decorative title={`Remove ${name}`} />
          </Button>
        </Box>
      </FlexBox>
    </FlexBox>
  );
};
