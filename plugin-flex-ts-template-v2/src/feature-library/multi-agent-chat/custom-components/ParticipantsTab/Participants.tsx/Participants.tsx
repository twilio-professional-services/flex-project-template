import { Stack, Card, Heading } from "@twilio-paste/core"
import { Participant } from "../Participant/Participant"
import { ParticipantDetails} from "../../../types/ParticipantDetails"

interface ParticipantsProps {
  participantDetails: ParticipantDetails[];
}

export const Participants = ({ participantDetails }: ParticipantsProps) => {

    console.log(participantDetails)
    
    const participants = participantDetails.map((participantDetail) => {
        const participantType = participantDetail.participantType;
        const isMe = participantDetail.isMe
        const allowKick = !isMe && participantType === "agent"
        const participantName = participantDetail.friendlyName
                     
        return <Participant name={participantName} participantType={participantType} allowKick={allowKick} />
    })
    
    return (
        <Card padding="space60">
            <Heading as="h2" variant="heading20">Participants</Heading>
            <Stack orientation="vertical" spacing="space20">{participants}</Stack>
        </Card >
    )
}