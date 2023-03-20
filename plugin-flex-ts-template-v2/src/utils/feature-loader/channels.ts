import * as Flex from '@twilio/flex-ui';

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  console.info(`Feature ${feature} registered channel hook: %c${hook.channelHook.name}`, 'font-weight:bold');
  // returns a task channel to register
  const channel = hook.channelHook(flex, manager);
  flex.TaskChannels.register(channel);
};
