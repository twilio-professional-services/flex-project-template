import * as Flex from '@twilio/flex-ui';
import { Stack, Card, Heading } from "@twilio-paste/core"
import { ConversationState, styled } from '@twilio/flex-ui';
import { Participants } from "./Participants.tsx/Participants"
import { InviteParticipant } from "./InviteParticipant/InviteParticipant"

const ParticipantsTabContainer = styled.div`
  padding-left: 3%;
  padding-right: 3%;
  padding-top: 3%;
  width: 100%;
`

interface ParticipantsTabProps {
  task: Flex.ITask;
  conversation: ConversationState.ConversationState;
}

export const ParticipantsTab = ({task, conversation} :ParticipantsTabProps ) => {
           
  return <ParticipantsTabContainer>
    <Stack orientation="vertical" spacing="space40">

      <Participants conversation={conversation} />
                
      <Card padding="space60">
        <Heading as="h2" variant="heading20">Invited Participants</Heading>
      </Card>

      <InviteParticipant />
    </Stack>
 </ParticipantsTabContainer>
}
  
