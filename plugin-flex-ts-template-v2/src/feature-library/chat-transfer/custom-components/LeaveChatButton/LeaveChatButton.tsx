import { Button, ConversationState, Actions } from "@twilio/flex-ui";
import { useState} from "react"

interface LeaveChatButtonProps {
    conversation: ConversationState.ConversationState;
}

const LeaveChatButton = ({ conversation }: LeaveChatButtonProps) => {
    const [buttonDisabled, setButtonDisable] = useState(false)
    const handleLeaveChatClick = () => {
        if (conversation) {
            setButtonDisable(true);
            Actions.invokeAction("LeaveChat", { conversation })
        }
    }
    return (
        <Button
            variant="primary"
            className="Twilio-TaskCanvasHeader-EndButton"
            size="small" onClick={handleLeaveChatClick}
            disabled={buttonDisabled}>
        Leave Chat
        </Button>
    )
}

export default LeaveChatButton;