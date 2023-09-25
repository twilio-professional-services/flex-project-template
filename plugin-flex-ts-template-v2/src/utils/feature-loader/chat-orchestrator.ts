import * as Flex from '@twilio/flex-ui';

import logger from '../logger';

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  // returns object with event and handler
  const { event, handler } = hook.chatOrchestratorHook(flex, manager);
  logger.debug(`Feature ${feature} registered ${event} chat orchestrator hook: ${handler.name}`);
  flex.ChatOrchestrator.setOrchestrations(event, handler);
};
