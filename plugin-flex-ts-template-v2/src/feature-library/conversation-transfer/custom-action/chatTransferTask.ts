import { Actions, Notifications, StateHelper } from '@twilio/flex-ui';

import { TransferActionPayload } from '../types/ActionPayloads';
import { NotificationIds } from '../flex-hooks/notifications/TransferResult';
import ChatTransferService, { buildInviteParticipantAPIPayload } from '../helpers/APIHelper';
import { isMultiParticipantEnabled } from '../config';
import { addInviteToConversation, countOfOutstandingInvitesForConversation } from '../helpers/inviteTracker';

const handleChatTransferAction = async (payload: TransferActionPayload) => {
  const { task, targetSid } = payload;
  console.log('transfer', payload);

  const conversation = StateHelper.getConversationStateForTask(task);

  if (conversation && countOfOutstandingInvitesForConversation(conversation) !== 0) {
    Notifications.showNotification(NotificationIds.ChatCancelParticipantInviteFailedInviteOutstanding);
    return;
  }

  if (payload?.options?.mode === 'WARM' && !isMultiParticipantEnabled()) {
    Notifications.showNotification(NotificationIds.ChatTransferFailedConsultNotSupported);
    return;
  }

  const removeInvitingAgent = payload?.options?.mode === 'COLD';
  const transferChatAPIPayload = await buildInviteParticipantAPIPayload(task, targetSid, removeInvitingAgent);

  if (!transferChatAPIPayload) {
    Notifications.showNotification(NotificationIds.ChatTransferFailedGeneric);
    return;
  }

  try {
    const result = await ChatTransferService.sendTransferChatAPIRequest(transferChatAPIPayload);

    addInviteToConversation(task, result.invitesTaskSid, targetSid);

    if (removeInvitingAgent) Notifications.showNotification(NotificationIds.ChatTransferTaskSuccess);
    else Notifications.showNotification(NotificationIds.ChatParticipantInvited);
  } catch (error) {
    console.error('transfer API request failed', error);
    Notifications.showNotification(NotificationIds.ChatTransferFailedGeneric);
  }
};

export const registerCustomChatTransferAction = () => {
  Actions.registerAction('ChatTransferTask', async (payload: any) =>
    handleChatTransferAction(payload as TransferActionPayload),
  );
};
