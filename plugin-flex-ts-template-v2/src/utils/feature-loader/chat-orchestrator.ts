import * as Flex from '@twilio/flex-ui';

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  // returns object with event and handler
  const { event, handler } = hook.chatOrchestratorHook(flex, manager);
  console.info(
    `Feature ${feature} registered %c${event} %cchat orchestrator hook: %c${handler.name}`,
    'font-weight:bold',
    'font-weight:normal',
    'font-weight:bold',
  );
  flex.ChatOrchestrator.setOrchestrations(event, handler);
};
