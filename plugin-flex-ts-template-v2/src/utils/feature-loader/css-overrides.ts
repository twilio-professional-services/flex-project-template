import * as Flex from '@twilio/flex-ui';
import merge from 'lodash/merge';

let overrides = {};

export const init = (manager: Flex.Manager) => {
  manager.updateConfig({
    theme: {
      componentThemeOverrides: {
        ...overrides,
      },
    },
  });
};

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  console.info(`Feature ${feature} registered CSS override hook: %c${hook.cssOverrideHook.name}`, 'font-weight:bold');
  const override = hook.cssOverrideHook(flex, manager);
  overrides = merge(overrides, override);
};
