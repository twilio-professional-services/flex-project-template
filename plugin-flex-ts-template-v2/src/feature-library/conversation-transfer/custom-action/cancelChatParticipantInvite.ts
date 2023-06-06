import { Actions, Notifications } from '@twilio/flex-ui';

import TaskService from '../../../utils/serverless/TaskRouter/TaskRouterService';
import { removeInvitedParticipant } from '../helpers/inviteTracker';
import { NotificationIds } from '../flex-hooks/notifications/TransferResult';
import { CancelChatParticipantInviteActionPayload } from '../types/ActionPayloads';

const handleCancelChatParticipantInvite = async (payload: CancelChatParticipantInviteActionPayload) => {
  const { conversation, invitesTaskSid } = payload;
  console.log('handleCancelChatParticipantInvite', conversation, invitesTaskSid);

  try {
    await TaskService.updateTaskAssignmentStatus(invitesTaskSid, 'canceled');

    if (conversation?.source?.sid && conversation?.source?.attributes) {
      await removeInvitedParticipant(conversation.source.sid, conversation.source.attributes as object, invitesTaskSid);
    }

    Notifications.showNotification(NotificationIds.ChatCancelParticipantInviteSuccess);
  } catch (error) {
    console.error('handleCancelChatParticipantInvite API request failed', error);
    Notifications.showNotification(NotificationIds.ChatCancelParticipantInviteFailed);
  }
};

export const registerCancelChatParticipantInvite = () => {
  Actions.registerAction('CancelChatParticipantInvite', async (payload: any) =>
    handleCancelChatParticipantInvite(payload as CancelChatParticipantInviteActionPayload),
  );
};
