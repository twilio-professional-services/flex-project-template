import { TaskContext } from '@twilio/flex-ui';
import { Stack, Badge } from '@twilio-paste/core';

export const ParticipantTabLabelContainer = () => {
  return (
    <TaskContext.Consumer>
      {(context) => {
        const participantCount = context.conversation?.participants?.size as number;

        return (
          <Stack orientation="horizontal" spacing="space20">
            Participants
            <Badge as="span" variant="info">
              {participantCount}
            </Badge>
          </Stack>
        );
      }}
    </TaskContext.Consumer>
  );
};
