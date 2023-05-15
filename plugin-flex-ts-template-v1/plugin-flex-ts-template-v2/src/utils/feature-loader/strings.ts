import * as Flex from '@twilio/flex-ui';

let customStrings = {};

export const init = (manager: Flex.Manager) => {
  manager.strings = {
    // -v- Add custom strings here -v-'
    ...customStrings,
    // -^---------------------------^-

    ...manager.strings,

    // -v- Modify strings provided by flex here -v-
    // WorkerDirectoryAgentsTabLabel: '<span style="font-size: 10px;">Agents</span>',
    // WorkerDirectoryQueuesTabLabel: '<span style="font-size: 10px;">Queues</span>',
    // -^----------------------------------------^-
  };
};

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  console.info(`Feature ${feature} registered string hook: %c${hook.stringHook.name}`, 'font-weight:bold');
  // Returns dictionary of string definitions to register
  const hookStrings = hook.stringHook(flex, manager);
  customStrings = {
    ...customStrings,
    ...hookStrings,
  };
};
