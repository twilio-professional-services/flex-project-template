import * as Flex from '@twilio/flex-ui';
import { merge } from 'lodash';

import logger from '../logger';

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
  logger.debug(`Feature ${feature} registered CSS override hook: ${hook.cssOverrideHook.name}`);
  const override = hook.cssOverrideHook(flex, manager);
  overrides = merge(overrides, override);
};
