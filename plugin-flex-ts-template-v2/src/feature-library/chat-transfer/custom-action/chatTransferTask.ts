import { Actions, Notifications } from "@twilio/flex-ui";
import { EventPayload } from "../types/TransferOptions";
import { NotificationIds } from "../flex-hooks/notifications/TransferResult";
import ChatTransferService, {
  buildInviteParticipantAPIPayload,
} from "../helpers/APIHelper";
import { isMultiParticipantEnabled } from "..";
import { addInviteToConversation } from "../helpers/inviteTracker";

export const registerCustomChatTransferAction = () => {
  Actions.registerAction("ChatTransferTask", (payload) =>
    handleChatTransferAction(payload)
  );
};

const handleChatTransferAction = async (payload: EventPayload | any) => {
  console.log("transfer", payload);

  if (payload?.options?.mode === "WARM" && !isMultiParticipantEnabled()) {
    Notifications.showNotification(
      NotificationIds.ChatTransferFailedConsultNotSupported
    );
    return;
  }

  const removeInvitingAgent = payload?.options?.mode === "COLD";
  const transferChatAPIPayload = await buildInviteParticipantAPIPayload(
    payload.task,
    payload.targetSid,
    removeInvitingAgent
  );

  if (!transferChatAPIPayload) {
    Notifications.showNotification(NotificationIds.ChatTransferFailedGeneric);
    return;
  }

  try {
    const result = await ChatTransferService.sendTransferChatAPIRequest(
      transferChatAPIPayload
    );

    addInviteToConversation(
      payload.task,
      result.invitesTaskSid,
      payload.targetSid
    );

    if (removeInvitingAgent)
      Notifications.showNotification(NotificationIds.ChatTransferTaskSuccess);
    else Notifications.showNotification(NotificationIds.ChatParticipantInvited);
  } catch (error) {
    console.error("transfer API request failed", error);
    Notifications.showNotification(NotificationIds.ChatTransferFailedGeneric);
  }
};
