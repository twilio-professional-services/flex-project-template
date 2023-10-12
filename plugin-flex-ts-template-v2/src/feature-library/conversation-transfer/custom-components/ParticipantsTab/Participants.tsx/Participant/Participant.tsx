import { Flex as FlexBox } from '@twilio-paste/core/flex';
import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { UserIcon } from '@twilio-paste/icons/esm/UserIcon';
import { AgentIcon } from '@twilio-paste/icons/esm/AgentIcon';
import { CloseIcon } from '@twilio-paste/icons/esm/CloseIcon';
import { useState } from 'react';
import { templates } from '@twilio/flex-ui';

import { ParticipantType } from '../../../../types/ParticipantDetails';
import { StringTemplates } from '../../../../flex-hooks/strings/ChatTransferStrings';

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
      <AgentIcon decorative={false} title={templates[StringTemplates.Agent]()} />
    ) : (
      <UserIcon decorative={false} title={templates[StringTemplates.Customer]()} />
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
            <CloseIcon decorative title={templates[StringTemplates.Remove]({ name })} />
          </Button>
        </Box>
      </FlexBox>
    </FlexBox>
  );
};
