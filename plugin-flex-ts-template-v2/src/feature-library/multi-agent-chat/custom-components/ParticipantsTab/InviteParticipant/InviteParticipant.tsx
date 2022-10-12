import { Stack, Card, Heading, Button, Box } from "@twilio-paste/core"
import { AgentIcon } from "@twilio-paste/icons/esm/AgentIcon";
import { ChatIcon } from "@twilio-paste/icons/esm/ChatIcon";

export const InviteParticipant = () => {
    return <>
        <Card padding="space60">
        <Heading as="h2" variant="heading20">Invite a Participant</Heading>

            <Stack orientation="horizontal" spacing="space30">
                <Box paddingTop="space20">
            <Button variant="primary">
               <AgentIcon decorative/> Invite Specific Agent
                    </Button>
                </Box>
                                <Box paddingTop="space20">

            <Button variant="primary">
                <ChatIcon decorative /> Invite from Queue
                    </Button>
                    </Box>
        </Stack>
        </Card >
    </>
}