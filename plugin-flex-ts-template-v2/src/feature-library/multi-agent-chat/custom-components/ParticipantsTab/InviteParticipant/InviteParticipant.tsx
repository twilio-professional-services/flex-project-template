import { useState } from "react"
import { Stack, Card, Heading, Button, Box } from "@twilio-paste/core"
import { AgentIcon } from "@twilio-paste/icons/esm/AgentIcon";
import { ChatIcon } from "@twilio-paste/icons/esm/ChatIcon";
import { InviteParticipantModal } from "./InviteParticipantModal/InviteParticipantModal";

export const InviteParticipant = () => {
// Modal properties
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
    return <>
        <Card padding="space60">
            <Heading as="h2" variant="heading20">Invite a Participant</Heading>

            <Stack orientation="horizontal" spacing="space30">
                <Box paddingTop="space20">
                    <Button variant="primary" onClick={handleOpen}>
                        <AgentIcon decorative/> Invite Specific Agent
                    </Button>
                </Box>
                <Box paddingTop="space20">
                    <Button variant="primary">
                        <ChatIcon decorative /> Invite from Queue
                    </Button>
                </Box>
            </Stack>
        </Card>

        <InviteParticipantModal isOpen={isOpen} handleClose={handleClose} />
    </>
}