import * as Flex from '@twilio/flex-ui';

import logger from '../logger';

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  logger.debug(`Feature ${feature} registered channel hook: ${hook.channelHook.name}`);
  // returns a task channel to register (or not - if it's overriding a default channel)
  const channel = hook.channelHook(flex, manager);
  if (channel) {
    // Must be a new channel, so register it
    flex.TaskChannels.register(channel);
  }
};
