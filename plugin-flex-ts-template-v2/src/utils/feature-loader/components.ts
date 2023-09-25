import * as Flex from '@twilio/flex-ui';

import logger from '../logger';

const componentHooks = [] as any[];

export const init = (flex: typeof Flex, manager: Flex.Manager) => {
  for (const hook of componentHooks) {
    hook.componentHook(flex, manager);
  }
};

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  logger.debug(`Feature ${feature} registered ${hook.componentName} component hook: ${hook.componentHook.name}`);
  componentHooks.push(hook);
};
