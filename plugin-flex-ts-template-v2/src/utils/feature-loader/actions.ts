import * as Flex from '@twilio/flex-ui';

import logger from '../logger';

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  logger.debug(
    `Feature ${feature} registered ${hook.actionEvent}${hook.actionName} action hook: ${hook.actionHook.name}`,
  );
  hook.actionHook(flex, manager);
};
