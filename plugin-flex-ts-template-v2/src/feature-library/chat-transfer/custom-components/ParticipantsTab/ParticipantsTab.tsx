import * as Flex from '@twilio/flex-ui';
import {useState, useEffect} from "react"
import { Stack} from "@twilio-paste/core"
import { ConversationState, styled, Actions } from '@twilio/flex-ui';
import { Participants } from "./Participants.tsx/Participants"
import { InviteParticipant } from "./InviteParticipant/InviteParticipant"
import { InvitedParticipants } from './InvitedParticipants/InvitedParticipants';
import { ParticipantDetails } from "../../types/ParticipantDetails"
import { InvitedParticipantDetails } from '../../types/InvitedParticipantDetails';
import { getUpdatedParticipantDetails, getUpdatedInvitedParticipantDetails } from "./hooks"
import {checkAndRemoveOldInvitedParticipants} from "../../helpers/inviteTracker"

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
  const [invitedParticipantDetails, setInvitedParticipantDetails] = useState<InvitedParticipantDetails[]>([])

  useEffect(() => {
    const updateParticipants = () => {
      
      getUpdatedParticipantDetails(task, conversation, participantDetails).then(
        participantDetails => {
          if (participantDetails)
            setParticipantDetails(participantDetails)
        }
      )
    }

    const updateInvitedParticipants = () => {
      checkAndRemoveOldInvitedParticipants(task, conversation);
    }

    updateParticipants();
    updateInvitedParticipants();
    setInvitedParticipantDetails(getUpdatedInvitedParticipantDetails(conversation))
  }, [conversation])

  const handleKickParticipant = (interactionParticipantSid : string) => {
    Actions.invokeAction("RemoveChatParticipant", {task, interactionParticipantSid})
  }

  const handleCancelInvite = (invitedParticipantDetails: InvitedParticipantDetails) => {
    Actions.invokeAction("CancelChatParticipantInvite", { conversation, invitesTaskSid: invitedParticipantDetails.invitesTaskSid })
  }
          
  return <ParticipantsTabContainer>
    <Stack orientation="vertical" spacing="space40">

      <Participants participantDetails={participantDetails} handleKickParticipant={handleKickParticipant} />
                
      <InvitedParticipants invitedParticipantDetails={invitedParticipantDetails} handleCancelInvite={handleCancelInvite} />

      <InviteParticipant task={task} />
    </Stack>
 </ParticipantsTabContainer>
}
  
