import * as Flex from '@twilio/flex-ui';
import { getWorkerFriendlyName } from '../../../utils/serverless/ChatTransferService';
import { Worker } from 'types/task-router';
import { Conversation } from '@twilio/conversations';
import { isFeatureEnabled } from '../../../index';


// when an agent joins a channel for the first time this announces
// them in the chat channel
export function announceOnChannelWhenJoined(flex: typeof Flex, manager: Flex.Manager, conversation: Conversation) {

  if(!isFeatureEnabled()) return;
  
  const task = Flex.TaskHelper.getTaskFromConversationSid(conversation.sid);
  
  if (!(task && Flex.TaskHelper.isChatBasedTask(task) && !Flex.TaskHelper.isCBMTask(task))) {
    // do not handle if this is CBM
    return;
  }
  
  Flex.Actions.invokeAction('SendMessage', {
    conversationSid: conversation.sid,
    body: `${getWorkerFriendlyName(manager.workerClient as unknown as Worker)} joined the channel`,
    messageAttributes: { notification: true }
  });
}
