
import { Flex as FlexBox, Box, Button } from "@twilio-paste/core"
import { ChatIcon } from "@twilio-paste/icons/esm/ChatIcon";
import { AgentIcon } from "@twilio-paste/icons/esm/AgentIcon";
import { CloseIcon } from "@twilio-paste/icons/esm/CloseIcon";


export const InvitedParticipant = (props: any) => {
  const { participantName, inviteTargetType, allowCancel } = props;

  const icon = inviteTargetType === "Worker" ? <AgentIcon decorative={false} title={`Agent - ${participantName}`} />
    : <ChatIcon decorative title={`Queue - ${participantName}`} />
    
  return (
    <FlexBox>
      <FlexBox>
        <Box
          padding="space20">
          {icon}
        </Box>
      </FlexBox>
      <FlexBox grow>
        <Box
          padding="space20"
          width="100%">
          {participantName}
        </Box>
      </FlexBox>
      <FlexBox>
        <Box
          padding="space20">
          <Button variant="secondary" size="icon" disabled={allowCancel}>
            <CloseIcon decorative title={`Cancel ${participantName}`} />
          </Button>
        </Box>
      </FlexBox>
    </FlexBox>)

}