import { Button, ConversationState, Actions } from '@twilio/flex-ui';
import { LeaveChatActionPayload } from 'feature-library/conversation-transfer/types/ActionPayloads';
import { useState } from 'react';

interface LeaveChatButtonProps {
  conversation: ConversationState.ConversationState;
}

const LeaveChatButton = ({ conversation }: LeaveChatButtonProps) => {
  const [buttonDisabled, setButtonDisable] = useState(false);
  const handleLeaveChatClick = () => {
    if (conversation) {
      setButtonDisable(true);
      const payload: LeaveChatActionPayload = { conversation };
      Actions.invokeAction('LeaveChat', payload);
    }
  };
  return (
    <Button
      variant="primary"
      className="Twilio-TaskCanvasHeader-EndButton"
      size="small"
      onClick={handleLeaveChatClick}
      disabled={buttonDisabled}
    >
      Leave Chat
    </Button>
  );
};

export default LeaveChatButton;
