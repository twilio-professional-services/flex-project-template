import { Stack, Card, Heading } from "@twilio-paste/core"
import { InvitedParticipant } from "./InvitedParticipant/InvitedParticipant";
import { InvitedParticipantDetails } from "../../../types/InvitedParticipantDetails"



interface InvitedParticipantsProps {
  invitedParticipantDetails: InvitedParticipantDetails[];
}

export const InvitedParticipants = ({ invitedParticipantDetails }: InvitedParticipantsProps) => {

    console.log("Participants", invitedParticipantDetails)
    
    const invitedParticipants = invitedParticipantDetails.map((invitedParticipantDetail) => {
      const participantName = invitedParticipantDetail.targetName;
      const inviteTargetType = invitedParticipantDetail.inviteTargetType;
        return <InvitedParticipant participantName={participantName} inviteTargetType={inviteTargetType} allowKick/>
    })
    
    return (
      <Card padding="space60">
            <Heading as="h2" variant="heading20">Invited Participants</Heading>
            <Stack orientation="vertical" spacing="space20">{invitedParticipants}</Stack>

      </Card>
    )
}