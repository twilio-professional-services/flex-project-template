import { TaskHelper, Notifications, templates, Manager } from '@twilio/flex-ui';

import { ParkInteractionNotification, UnparkInteractionNotification } from '../flex-hooks/notifications';
import { StringTemplates } from '../flex-hooks/strings';
import ParkInteractionPayload, { UnparkInteractionPayload } from '../types/ParkInteractionPayload';
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
      agent.channelType,
      payload.task.taskSid,
      payload.task.workflowSid,
      payload.task.taskChannelUniqueName,
      payload.task.queueName,
      payload.task.queueSid,
      JSON.stringify(payload.task.attributes),
    );

    Notifications.dismissNotificationById(ParkInteractionNotification.ParkError);

    setTimeout(() => {
      // Work around a Flex bug where a CONVERSATION_UPDATE happens after CONVERSATION_UNLOAD,
      // which results in the conversation not loading until Flex UI is reloaded
      Manager.getInstance().store.dispatch({
        type: 'CONVERSATION_UNLOAD',
        payload: {},
        meta: {
          conversationSid: agent.mediaProperties.conversationSid,
          channelSid: agent.mediaProperties.conversationSid,
        },
      });
    }, 2000);

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

export const unparkInteraction = async (payload: UnparkInteractionPayload) => {
  try {
    await ParkInteractionService.unparkInteraction(payload.ConversationSid, payload.WebhookSid);
    return Notifications.showNotification(UnparkInteractionNotification.UnparkSuccess);
  } catch (error) {
    const message = (error as any)?.message;
    console.log(message);
    if (message.status === 400) return Notifications.showNotification(UnparkInteractionNotification.UnparkError);
    return Notifications.showNotification(UnparkInteractionNotification.UnparkError, {
      message,
    });
  }
};
