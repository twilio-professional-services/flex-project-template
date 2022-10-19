import { Actions, Notifications, ITask } from "@twilio/flex-ui";
import ChatTransferService, {
  buildRemovePartiticipantAPIPayload,
} from ".././helpers/APIHelper";
import { NotificationIds } from "../flex-hooks/notifications/TransferResult";

export const registerRemoveChatParticipant = () => {
  Actions.registerAction("RemoveChatParticipant", (payload) =>
    handleRemoveChatParticipant(
      payload.task as ITask,
      payload.interactionParticipantSid as string
    )
  );
};

const handleRemoveChatParticipant = async (
  task: ITask,
  interactionParticipantSid: string
) => {
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
