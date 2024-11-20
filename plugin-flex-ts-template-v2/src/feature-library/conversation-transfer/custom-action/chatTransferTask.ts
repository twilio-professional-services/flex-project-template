import { Actions, Manager, Notifications, StateHelper } from '@twilio/flex-ui';

import { TransferActionPayload } from '../types/ActionPayloads';
import { NotificationIds } from '../flex-hooks/notifications/TransferResult';
import ChatTransferService, { buildInviteParticipantAPIPayload } from '../helpers/APIHelper';
import { isColdTransferEnabled, isMultiParticipantEnabled } from '../config';
import { ConversationsHelper } from '../../../utils/helpers';
import logger from '../../../utils/logger';
import { addPendingTransfer, removePendingTransfer } from '../flex-hooks/states';

const handleChatTransferAction = async (payload: TransferActionPayload) => {
  const { task, targetSid } = payload;
  const manager = Manager.getInstance();
  logger.debug('[conversation-transfer] transfer', payload);
  manager.store.dispatch(addPendingTransfer(task.sid));

  const conversation = StateHelper.getConversationStateForTask(task);

  if (conversation && ConversationsHelper.countOfOutstandingInvitesForConversation(conversation) !== 0) {
    Notifications.showNotification(NotificationIds.ChatCancelParticipantInviteFailedInviteOutstanding);
    manager.store.dispatch(removePendingTransfer(task.sid));
    return;
  }

  if (payload?.options?.mode === 'WARM' && !isMultiParticipantEnabled()) {
    Notifications.showNotification(NotificationIds.ChatTransferFailedConsultNotSupported);
    manager.store.dispatch(removePendingTransfer(task.sid));
    return;
  }

  if (payload?.options?.mode === 'COLD' && !isColdTransferEnabled()) {
    Notifications.showNotification(NotificationIds.ChatTransferFailedColdNotSupported);
    manager.store.dispatch(removePendingTransfer(task.sid));
    return;
  }

  let transferChatAPIPayload;

  try {
    transferChatAPIPayload = await buildInviteParticipantAPIPayload(task, targetSid, payload?.options);
  } catch (error: any) {
    logger.error('[conversation-transfer] Error building invite payload', error);
  }

  if (!transferChatAPIPayload) {
    Notifications.showNotification(NotificationIds.ChatTransferFailedGeneric);
    manager.store.dispatch(removePendingTransfer(task.sid));
    return;
  }

  if ((transferChatAPIPayload.workersToIgnore as any).workerSidsInConversation.indexOf(targetSid) >= 0) {
    Notifications.showNotification(NotificationIds.ChatTransferFailedAlreadyParticipating);
    manager.store.dispatch(removePendingTransfer(task.sid));
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
  manager.store.dispatch(removePendingTransfer(task.sid));
};

export const registerCustomChatTransferAction = () => {
  Actions.registerAction('ChatTransferTask', async (payload: any) =>
    handleChatTransferAction(payload as TransferActionPayload),
  );
};
