import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import { getEndChatMessage } from '../../config';

// beforeCompleteTask fires for every task on its way to completed, regardless of
// whether it went through a wrap-up step first (voice/legacy chat) or not (WhatsApp
// via Conversations goes straight from active to complete) - so a single listener here
// covers all channels without double-sending the message.
const AUTO_CLOSE_CHANNEL_TYPES = ['chat', 'web', 'whatsapp'];

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.CompleteTask;
export const actionHook = function sendEndChatMessageBeforeCompleteTask(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    const message = getEndChatMessage();
    const channelType = payload.task?.attributes?.channelType;

    if (!message || !AUTO_CLOSE_CHANNEL_TYPES.includes(channelType)) {
      return;
    }

    await flex.Actions.invokeAction('SendMessage', {
      body: message,
      conversationSid: payload.task.attributes.conversationSid,
    });
  });
};
