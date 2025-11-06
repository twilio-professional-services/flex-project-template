import { TaskContext, Template, templates } from '@twilio/flex-ui';
import { Badge } from '@twilio-paste/core/badge';
import { Stack } from '@twilio-paste/core/stack';

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
