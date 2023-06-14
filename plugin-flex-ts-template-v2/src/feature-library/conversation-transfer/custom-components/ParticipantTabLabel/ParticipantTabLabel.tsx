import { TaskContext, Template, templates } from '@twilio/flex-ui';
import { Stack, Badge } from '@twilio-paste/core';

import { StringTemplates } from '../../flex-hooks/strings/ChatTransferStrings';

export const ParticipantTabLabelContainer = () => {
  return (
    <TaskContext.Consumer>
      {(context) => {
        const participantCount = context.conversation?.participants?.size as number;

        return (
          <Stack orientation="horizontal" spacing="space20">
            <Template source={templates[StringTemplates.Participants]} />
            <Badge as="span" variant="info">
              {participantCount}
            </Badge>
          </Stack>
        );
      }}
    </TaskContext.Consumer>
  );
};
