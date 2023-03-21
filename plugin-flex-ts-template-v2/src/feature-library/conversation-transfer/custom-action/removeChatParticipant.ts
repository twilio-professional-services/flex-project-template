import { Actions, Notifications } from '@twilio/flex-ui';

import ChatTransferService, { buildRemovePartiticipantAPIPayload } from '../helpers/APIHelper';
import { NotificationIds } from '../flex-hooks/notifications/TransferResult';
import { RemoveChatParticipantActionPayload } from '../types/ActionPayloads';

const handleRemoveChatParticipant = async (payload: RemoveChatParticipantActionPayload) => {
  const { task, interactionParticipantSid } = payload;
  console.log('handleRemoveChatParticipant', task, interactionParticipantSid);

  const removePartcipantAPIPayload = buildRemovePartiticipantAPIPayload(task, interactionParticipantSid);

  if (!removePartcipantAPIPayload) {
    console.error('error building removePartcipantAPIPayload');
    Notifications.showNotification(NotificationIds.ChatRemoveParticipantFailed);
    return;
  }

  try {
    await ChatTransferService.removeParticipantAPIRequest(removePartcipantAPIPayload);

    Notifications.showNotification(NotificationIds.ChatRemoveParticipantSuccess);
  } catch (error) {
    console.error('remove participant API request failed', error);
    Notifications.showNotification(NotificationIds.ChatRemoveParticipantFailed);
  }
};

export const registerRemoveChatParticipant = () => {
  Actions.registerAction('RemoveChatParticipant', async (payload: any) =>
    handleRemoveChatParticipant(payload as RemoveChatParticipantActionPayload),
  );
};
