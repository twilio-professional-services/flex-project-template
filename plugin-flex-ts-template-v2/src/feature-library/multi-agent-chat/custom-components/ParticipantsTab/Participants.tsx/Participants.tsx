import * as Flex from '@twilio/flex-ui';
import { Stack, Card, Heading } from "@twilio-paste/core"
import { ConversationState } from '@twilio/flex-ui';
import { ChatProperties } from '@twilio/flex-ui/src/state/Participants/participants.types';
import { Participant} from "../Participant/Participant"
    
interface ParticipantDetails {
  friendlyName: string,
  participantType: string,
  isMe: boolean,
  interactionParticipantSid: string,
  conversationMemberSid: string
}
const manager = Flex.Manager.getInstance();

const getParticipantDetails = (conversation: ConversationState.ConversationState) => {
    // we use a mix of conversation (MBxxx sids) and Interactions Participants (UTxxx) to build what we need
    const myIdentity = manager.user.identity
    const flexState = manager.store.getState().flex;

    const participants: ParticipantDetails[] = []

    const conversationParticipants = Array.from(conversation.participants.values())
    const intertactionParticipants = Object.values(flexState.participants.bySid)

    conversationParticipants.forEach(conversationParticipant => {
        const intertactionParticipant = intertactionParticipants.find(participant =>
            (participant.mediaProperties as ChatProperties).sid == conversationParticipant.source.sid)
    
        if (intertactionParticipant) {
            const friendlyName = conversationParticipant.friendlyName || (intertactionParticipant.mediaProperties as ChatProperties).messagingBinding.address
            const participantType = intertactionParticipant.type;
            const isMe = conversationParticipant.source.identity === myIdentity;
            const interactionParticipantSid = intertactionParticipant.participantSid;
            const conversationMemberSid = conversationParticipant.source.sid;

            participants.push({ friendlyName, participantType, isMe, interactionParticipantSid, conversationMemberSid })
        }
    })
  
    return participants;
}

interface ParticipantsProps {
  conversation: ConversationState.ConversationState;
}

export const Participants = ({ conversation }: ParticipantsProps) => {
    const participantDetails = getParticipantDetails(conversation)

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