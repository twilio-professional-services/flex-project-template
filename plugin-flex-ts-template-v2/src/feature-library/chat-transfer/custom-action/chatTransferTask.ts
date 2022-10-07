import { Actions, Notifications } from "@twilio/flex-ui";
import { EventPayload } from "../types/TransferOptions";
import { NotificationIds } from "../flex-hooks/notifications/TransferResult";
import ChatTransferService, {
  buildTransferChatAPIPayload,
} from "../helpers/APIHelper";

export const registerCustomChatTransferAction = () => {
  Actions.registerAction("ChatTransferTask", (payload) =>
    handleChatTransferAction(payload)
  );
};

const handleChatTransferAction = async (payload: EventPayload | any) => {
  console.log("transfer", payload);

  if (payload?.options?.mode === "WARM") {
    Notifications.showNotification(
      NotificationIds.ChatTransferFailedConsultNotSupported
    );
    return;
  }

  const transferChatAPIPayload = await buildTransferChatAPIPayload(
    payload.task,
    payload.targetSid
  );

  if (!transferChatAPIPayload) {
    Notifications.showNotification(NotificationIds.ChatTransferFailedGeneric);
    return;
  }

  try {
    const result = await ChatTransferService.sendTransferChatAPIRequest(
      transferChatAPIPayload
    );
    Notifications.showNotification(NotificationIds.ChatTransferTaskSuccess);
  } catch (error) {
    console.error("transfer API request failed", error);
    Notifications.showNotification(NotificationIds.ChatTransferFailedGeneric);
  }
};
