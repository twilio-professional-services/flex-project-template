import { Actions, Notifications } from '@twilio/flex-ui';

import ChatTransferService, { buildRemoveMyPartiticipantAPIPayload } from '../helpers/APIHelper';
import { NotificationIds } from '../flex-hooks/notifications/TransferResult';
import { LeaveChatActionPayload } from '../types/ActionPayloads';

const handleLeaveChatAction = async (payload: LeaveChatActionPayload) => {
  const { conversation } = payload;
  console.log('handleLeaveChatAction', conversation.source?.sid);

  const removePartcipantAPIPayload = await buildRemoveMyPartiticipantAPIPayload(conversation);

  if (!removePartcipantAPIPayload) {
    console.error('error building removePartcipantAPIPayload');
    Notifications.showNotification(NotificationIds.ChatRemoveParticipantFailed);
    return;
  }

  try {
    await ChatTransferService.removeParticipantAPIRequest(removePartcipantAPIPayload);
  } catch (error) {
    console.error('remove participant API request failed', error);
    Notifications.showNotification(NotificationIds.ChatRemoveParticipantFailed);
  }
};

export const registerLeaveChatAction = () => {
  Actions.registerAction('LeaveChat', async (payload: any) => handleLeaveChatAction(payload as LeaveChatActionPayload));
};
