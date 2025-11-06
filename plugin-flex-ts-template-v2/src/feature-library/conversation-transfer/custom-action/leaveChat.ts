import { Actions, Notifications } from '@twilio/flex-ui';

import ChatTransferService, { buildRemoveMyPartiticipantAPIPayload } from '../helpers/APIHelper';
import { NotificationIds } from '../flex-hooks/notifications/TransferResult';
import { LeaveChatActionPayload } from '../types/ActionPayloads';
import logger from '../../../utils/logger';

const handleLeaveChatAction = async (payload: LeaveChatActionPayload) => {
  const { conversation } = payload;
  logger.debug(`[conversation-transfer] handleLeaveChatAction ${conversation.source?.sid}`);

  const removePartcipantAPIPayload = await buildRemoveMyPartiticipantAPIPayload(conversation);

  if (!removePartcipantAPIPayload) {
    logger.error('[conversation-transfer] error building removePartcipantAPIPayload');
    Notifications.showNotification(NotificationIds.ChatRemoveParticipantFailed);
    return;
  }

  try {
    await ChatTransferService.removeParticipantAPIRequest(removePartcipantAPIPayload);
  } catch (error: any) {
    logger.error('[conversation-transfer] remove participant API request failed', error);
    Notifications.showNotification(NotificationIds.ChatRemoveParticipantFailed);
  }
};

export const registerLeaveChatAction = () => {
  Actions.registerAction('LeaveChat', async (payload: any) => handleLeaveChatAction(payload as LeaveChatActionPayload));
};
