import * as Flex from '@twilio/flex-ui';

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  console.info(`Feature ${feature} registered channel hook: %c${hook.channelHook.name}`, 'font-weight:bold');
  // returns a task channel to register (or not - if it's overriding a default channel)
  const channel = hook.channelHook(flex, manager);
  if (channel) {
    // Must be a new channel, so register it
    flex.TaskChannels.register(channel);
  }
};
