import { Actions, Notifications, ITask } from "@twilio/flex-ui";
import ChatTransferService, {
  buildRemovePartiticipantAPIPayload,
} from ".././helpers/APIHelper";
import { NotificationIds } from "../flex-hooks/notifications/TransferResult";
import { RemoveChatParticipantActionPayload } from "../types/ActionPayloads";

export const registerRemoveChatParticipant = () => {
  Actions.registerAction("RemoveChatParticipant", (payload: any) =>
    handleRemoveChatParticipant(payload as RemoveChatParticipantActionPayload)
  );
};

const handleRemoveChatParticipant = async (
  payload: RemoveChatParticipantActionPayload
) => {
  const { task, interactionParticipantSid } = payload;
  console.log("handleRemoveChatParticipant", task, interactionParticipantSid);

  const removePartcipantAPIPayload = await buildRemovePartiticipantAPIPayload(
    task,
    interactionParticipantSid
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

    Notifications.showNotification(
      NotificationIds.ChatRemoveParticipantSuccess
    );
  } catch (error) {
    console.error("remove participant API request failed", error);
    Notifications.showNotification(NotificationIds.ChatRemoveParticipantFailed);
  }
};
