import * as Flex from '@twilio/flex-ui';

import { getWorkerFriendlyName } from '../../../utils/serverless/ChatTransferService';

// when an agent joins a channel for the first time this announces
// them in the chat channel
export function announceOnChannelWhenJoined(flex: typeof Flex, manager: Flex.Manager) {
  manager.chatClient.on('channelJoined', (channel) => {
    Flex.Actions.invokeAction('SendMessage', {
      channelSid: channel.sid,
      body: `${getWorkerFriendlyName(manager.workerClient)} joined the channel`,
      messageAttributes: { notification: true }
    });
  });
}
