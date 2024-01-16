import { Actions, Notifications, StateHelper } from '@twilio/flex-ui';

import { TransferActionPayload } from '../types/ActionPayloads';
import { NotificationIds } from '../flex-hooks/notifications/TransferResult';
import ChatTransferService, { buildInviteParticipantAPIPayload } from '../helpers/APIHelper';
import { isColdTransferEnabled, isMultiParticipantEnabled } from '../config';
import { countOfOutstandingInvitesForConversation } from '../helpers/inviteTracker';

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

  if (payload?.options?.mode === 'COLD' && !isColdTransferEnabled()) {
    Notifications.showNotification(NotificationIds.ChatTransferFailedColdNotSupported);
    return;
  }

  const transferChatAPIPayload = await buildInviteParticipantAPIPayload(task, targetSid, payload?.options);

  if (!transferChatAPIPayload) {
    Notifications.showNotification(NotificationIds.ChatTransferFailedGeneric);
    return;
  }

  if ((transferChatAPIPayload.workersToIgnore as any).workerSidsInConversation.indexOf(targetSid) >= 0) {
    Notifications.showNotification(NotificationIds.ChatTransferFailedAlreadyParticipating);
    return;
  }

  try {
    await ChatTransferService.sendTransferChatAPIRequest(transferChatAPIPayload);

    if (payload?.options?.mode === 'COLD') {
      Notifications.showNotification(NotificationIds.ChatTransferTaskSuccess);
    } else {
      Notifications.showNotification(NotificationIds.ChatParticipantInvited);
    }
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
