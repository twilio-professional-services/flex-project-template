import * as Flex from '@twilio/flex-ui';
import { getWorkerFriendlyName } from '../../../utils/serverless/ChatTransferService';
import { UIAttributes } from 'types/manager/ServiceConfiguration';
import { Worker } from 'types/task-router';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled } = custom_data.features.chat_transfer;


// when an agent joins a channel for the first time this announces
// them in the chat channel
export function announceOnChannelWhenJoined(flex: typeof Flex, manager: Flex.Manager) {

  if(!enabled) return;
  
  manager.chatClient.on('channelJoined', (channel) => {
    Flex.Actions.invokeAction('SendMessage', {
      channelSid: channel.sid,
      body: `${getWorkerFriendlyName(manager.workerClient as unknown as Worker)} joined the channel`,
      messageAttributes: { notification: true }
    });
  });
}
