import * as Flex from '@twilio/flex-ui';

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  console.info(
    `Feature ${feature} registered %c${hook.actionEvent}${hook.actionName} %caction hook: %c${hook.actionHook.name}`,
    'font-weight:bold',
    'font-weight:normal',
    'font-weight:bold',
  );
  hook.actionHook(flex, manager);
};
