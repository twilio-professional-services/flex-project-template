import { Actions, Notifications, ConversationState } from "@twilio/flex-ui";
import TaskService from "../../../utils/serverless/TaskRouter/TaskRouterService";
import { removeInvitedParticipant } from "../helpers/inviteTracker";
import { NotificationIds } from "../flex-hooks/notifications/TransferResult";

export const registerCancelChatParticipantInvite = () => {
  Actions.registerAction("CancelChatParticipantInvite", (payload) =>
    handleCancelChatParticipantInvite(
      payload.conversation as ConversationState.ConversationState,
      payload.invitesTaskSid as string
    )
  );
};

const handleCancelChatParticipantInvite = async (
  conversation: ConversationState.ConversationState,
  invitesTaskSid: string
) => {
  console.log(
    "handleCancelChatParticipantInvite",
    conversation,
    invitesTaskSid
  );

  try {
    await TaskService.updateTaskAssignmentStatus(invitesTaskSid, "canceled");
    await removeInvitedParticipant(conversation, invitesTaskSid);

    Notifications.showNotification(
      NotificationIds.ChatCancelParticipantInviteSuccess
    );
  } catch (error) {
    console.error(
      "handleCancelChatParticipantInvite API request failed",
      error
    );
    Notifications.showNotification(NotificationIds.ChatCancelParticipantInviteFailed);
  }
};
