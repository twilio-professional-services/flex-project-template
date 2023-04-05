import * as Flex from '@twilio/flex-ui';

const componentHooks = [] as any[];

export const init = (flex: typeof Flex, manager: Flex.Manager) => {
  for (const hook of componentHooks) {
    hook.componentHook(flex, manager);
  }
};

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  console.info(
    `Feature ${feature} registered %c${hook.componentName} %ccomponent hook: %c${hook.componentHook.name}`,
    'font-weight:bold',
    'font-weight:normal',
    'font-weight:bold',
  );
  componentHooks.push(hook);
};
