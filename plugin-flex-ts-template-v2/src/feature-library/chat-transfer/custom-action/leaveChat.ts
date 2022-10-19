import { Actions, ConversationState, Notifications } from "@twilio/flex-ui";
import ChatTransferService, {
  buildRemoveMyPartiticipantAPIPayload,
} from ".././helpers/APIHelper";
import { NotificationIds } from "../flex-hooks/notifications/TransferResult";

export const registerLeaveChatAction = () => {
  Actions.registerAction("LeaveChat", (payload) =>
    handleLeaveChatAction(
      payload.conversation as ConversationState.ConversationState
    )
  );
};

const handleLeaveChatAction = async (
  conversation: ConversationState.ConversationState
) => {
  console.log("handleLeaveChatAction", conversation.source?.sid);

  const removePartcipantAPIPayload = await buildRemoveMyPartiticipantAPIPayload(
    conversation
  );

  if (!removePartcipantAPIPayload) {
    console.error("error building removePartcipantAPIPayload");
    Notifications.showNotification(NotificationIds.ChatRemoveParticipantFailed);
    return;
  }

  try {
    const result = await ChatTransferService.removeParticipantAPIRequest(
      removePartcipantAPIPayload
    );
  } catch (error) {
    console.error("remove participant API request failed", error);
    Notifications.showNotification(NotificationIds.ChatRemoveParticipantFailed);
  }
};
