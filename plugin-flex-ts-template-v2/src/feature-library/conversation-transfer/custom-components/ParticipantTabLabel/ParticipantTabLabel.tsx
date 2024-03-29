import React from 'react';
import { Badge } from '@twilio-paste/core/badge';
import { Stack } from '@twilio-paste/core/stack';
import { TaskContext, Template, templates } from '@twilio/flex-ui';

import { StringTemplates } from '../../flex-hooks/strings/ChatTransferStrings';

const ParticipantBadgeCount = ({ participantCount }: { participantCount: number }) => (
  <Stack orientation="horizontal" spacing="space20">
    <Template source={templates[StringTemplates.Participants]} />
    <Badge as="span" variant="info">
      {participantCount.toString()}
    </Badge>
  </Stack>
);

export const ParticipantTabLabelContainer = () => {
  return (
    <TaskContext.Consumer>
      {(context: any) => {
        const participantCount = context.conversation?.participants?.size as number | 0;
        return <ParticipantBadgeCount participantCount={participantCount} />;
      }}
    </TaskContext.Consumer>
  );
};
