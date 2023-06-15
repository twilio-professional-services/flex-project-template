import { TaskHelper, Notifications, templates } from '@twilio/flex-ui';

import { ParkInteractionNotification } from '../flex-hooks/notifications';
import { StringTemplates } from '../flex-hooks/strings';
import ParkInteractionPayload from '../types/ParkInteractionPayload';
import ParkInteractionService from '../utils/ParkInteractionService';

const getAgent = async (payload: ParkInteractionPayload) => {
  const participants = await payload.task.getParticipants(payload.task.attributes.flexInteractionChannelSid);

  let agent;
  for (const p of participants) {
    if (p.type === 'agent') {
      agent = p;
      break;
    }
  }

  return agent;
};

export const parkInteraction = async (payload: ParkInteractionPayload) => {
  if (!TaskHelper.isCBMTask(payload.task)) {
    return Notifications.showNotification(ParkInteractionNotification.ParkError, {
      message: templates[StringTemplates.NonCbmError](),
    });
  }

  try {
    const agent = await getAgent(payload);

    await ParkInteractionService.parkInteraction(
      agent.channelSid,
      agent.interactionSid,
      agent.participantSid,
      agent.mediaProperties.conversationSid,
      payload.task.taskSid,
      payload.task.workflowSid,
      payload.task.taskChannelUniqueName,
      payload.task.queueName,
      payload.task.queueSid,
      JSON.stringify(payload.task.attributes),
    );

    Notifications.dismissNotificationById(ParkInteractionNotification.ParkError);
    return Notifications.showNotification(ParkInteractionNotification.ParkSuccess);
  } catch (error) {
    let message = (error as any)?.message;
    const twilioErrorCode = (error as any)?.twilioErrorCode;

    if (twilioErrorCode === 50388) {
      message = templates[StringTemplates.WebhookError]();
    }

    return Notifications.showNotification(ParkInteractionNotification.ParkError, {
      message,
    });
  }
};
