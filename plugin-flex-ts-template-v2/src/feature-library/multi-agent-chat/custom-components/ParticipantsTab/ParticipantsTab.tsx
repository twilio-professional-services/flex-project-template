import * as Flex from '@twilio/flex-ui';
import {useState, useEffect} from "react"
import { Stack, Card, Heading } from "@twilio-paste/core"
import { ConversationState, styled } from '@twilio/flex-ui';
import { Participants } from "./Participants.tsx/Participants"
import { InviteParticipant } from "./InviteParticipant/InviteParticipant"
import { ParticipantDetails } from "../../types/ParticipantDetails"
import { getParticipantDetails} from "./hooks"

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

export const ParticipantsTab = ({ task, conversation }: ParticipantsTabProps) => {
  const [participantDetails, setParticipantDetails] = useState<ParticipantDetails[]>([])

  useEffect(() => {
    setParticipantDetails(getParticipantDetails(conversation));
  }, [conversation])
  
           
  return <ParticipantsTabContainer>
    <Stack orientation="vertical" spacing="space40">

      <Participants participantDetails={participantDetails} />
                
      <Card padding="space60">
        <Heading as="h2" variant="heading20">Invited Participant</Heading>
      </Card>

      <InviteParticipant />
    </Stack>
 </ParticipantsTabContainer>
}
  
