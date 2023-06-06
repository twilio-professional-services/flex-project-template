import * as Flex from '@twilio/flex-ui';
import { Worker } from 'types/task-router';
import { Conversation } from '@twilio/conversations';

import { getWorkerFriendlyName } from '../../../utils/serverless/ChatTransferService';
import { FlexJsClient, ConversationEvent } from '../../../../../types/feature-loader';
import { StringTemplates } from '../../strings/ChatTransfer';

export const clientName = FlexJsClient.conversationsClient;
export const eventName = ConversationEvent.conversationJoined;
// when an agent joins a channel for the first time this announces
// them in the chat channel
export const jsClientHook = function announceOnChannelWhenJoined(
  flex: typeof Flex,
  manager: Flex.Manager,
  conversation: Conversation,
) {
  const task = Flex.TaskHelper.getTaskFromConversationSid(conversation.sid);

  if (!(task && Flex.TaskHelper.isChatBasedTask(task) && !Flex.TaskHelper.isCBMTask(task))) {
    // do not handle if this is CBM
    return;
  }

  Flex.Actions.invokeAction('SendMessage', {
    conversationSid: conversation.sid,
    body: flex.templates[StringTemplates.JoinMessage]({
      workerName: getWorkerFriendlyName(manager.workerClient as unknown as Worker),
    }),
    messageAttributes: { notification: true },
  });
};
