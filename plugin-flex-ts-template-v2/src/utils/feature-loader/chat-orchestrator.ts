import * as Flex from "@twilio/flex-ui";

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  console.info(`Feature ${feature} registered chat orchestrator hook: %c${hook.chatOrchestratorHook.name}`, 'font-weight:bold');
  // returns object with event and handler
  const { event, handler } = hook.chatOrchestratorHook(flex, manager);
  flex.ChatOrchestrator.setOrchestrations(event, handler);
}