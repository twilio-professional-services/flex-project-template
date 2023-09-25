import { Actions, Notifications } from '@twilio/flex-ui';

import ChatTransferService, { buildRemovePartiticipantAPIPayload } from '../helpers/APIHelper';
import { NotificationIds } from '../flex-hooks/notifications/TransferResult';
import { RemoveChatParticipantActionPayload } from '../types/ActionPayloads';
import logger from '../../../utils/logger';

const handleRemoveChatParticipant = async (payload: RemoveChatParticipantActionPayload) => {
  const { task, interactionParticipantSid } = payload;
  logger.debug('handleRemoveChatParticipant', task, interactionParticipantSid);

  const removePartcipantAPIPayload = buildRemovePartiticipantAPIPayload(task, interactionParticipantSid);

  if (!removePartcipantAPIPayload) {
    logger.error('error building removePartcipantAPIPayload');
    Notifications.showNotification(NotificationIds.ChatRemoveParticipantFailed);
    return;
  }

  try {
    await ChatTransferService.removeParticipantAPIRequest(removePartcipantAPIPayload);

    Notifications.showNotification(NotificationIds.ChatRemoveParticipantSuccess);
  } catch (error) {
    logger.error('remove participant API request failed', error);
    Notifications.showNotification(NotificationIds.ChatRemoveParticipantFailed);
  }
};

export const registerRemoveChatParticipant = () => {
  Actions.registerAction('RemoveChatParticipant', async (payload: any) =>
    handleRemoveChatParticipant(payload as RemoveChatParticipantActionPayload),
  );
};
