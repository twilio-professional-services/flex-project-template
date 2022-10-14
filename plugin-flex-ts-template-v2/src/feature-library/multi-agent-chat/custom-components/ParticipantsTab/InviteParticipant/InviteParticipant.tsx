import { useState } from "react"
import { Stack, Card, Heading, Button, Box } from "@twilio-paste/core"
import { AgentIcon } from "@twilio-paste/icons/esm/AgentIcon";
import { ChatIcon } from "@twilio-paste/icons/esm/ChatIcon";
import { InviteParticipantModal } from "./InviteParticipantModal/InviteParticipantModal";
import { ParticipantInvite, ParticipantInviteType } from "../../../types/ParticipantInvite"


export const InviteParticipant = () => {
// Modal properties
    const [participantModalType, setParticipantInviteModalType] = useState<ParticipantInviteType | null>(null);

    const handleOpenModal = (type: ParticipantInviteType): any => setParticipantInviteModalType(type);
    const handleCloseModal = () => setParticipantInviteModalType(null);

    const handleInviteParticipantClicked = (invitedParticipantDetails: ParticipantInvite) => {
        console.log("handleInviteParticipantClicked", invitedParticipantDetails)
        handleCloseModal();
    }


    return <>
        <Card padding="space60">
            <Heading as="h2" variant="heading20">Invite a Participant</Heading>

            <Stack orientation="horizontal" spacing="space30">
                <Box paddingTop="space20">
                    <Button variant="primary" onClick={() => handleOpenModal("Worker")}>
                        <AgentIcon decorative/> Invite Specific Agent
                    </Button>
                </Box>
                <Box paddingTop="space20">
                    <Button variant="primary" onClick={() => handleOpenModal("Queue")}>
                        <ChatIcon decorative /> Invite from Queue
                    </Button>
                </Box>
            </Stack>
        </Card>

        {participantModalType !== null &&
            <InviteParticipantModal participantModalType={participantModalType} handleClose={handleCloseModal} handleInviteParticipantClicked={handleInviteParticipantClicked} />
        }
    </>
}