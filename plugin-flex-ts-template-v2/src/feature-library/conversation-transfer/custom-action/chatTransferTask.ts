import { Actions, Notifications, StateHelper } from '@twilio/flex-ui';

import { TransferActionPayload } from '../types/ActionPayloads';
import { NotificationIds } from '../flex-hooks/notifications/TransferResult';
import ChatTransferService, { buildInviteParticipantAPIPayload } from '../helpers/APIHelper';
import { isColdTransferEnabled, isMultiParticipantEnabled } from '../config';
import { ConversationsHelper } from '../../../utils/helpers';
import logger from '../../../utils/logger';

const handleChatTransferAction = async (payload: TransferActionPayload) => {
  const { task, targetSid } = payload;
  logger.debug('[conversation-transfer] transfer', payload);

  const conversation = StateHelper.getConversationStateForTask(task);

  if (conversation && ConversationsHelper.countOfOutstandingInvitesForConversation(conversation) !== 0) {
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
  } catch (error: any) {
    logger.error('[conversation-transfer] transfer API request failed', error);
    Notifications.showNotification(NotificationIds.ChatTransferFailedGeneric);
  }
};

export const registerCustomChatTransferAction = () => {
  Actions.registerAction('ChatTransferTask', async (payload: any) =>
    handleChatTransferAction(payload as TransferActionPayload),
  );
};
