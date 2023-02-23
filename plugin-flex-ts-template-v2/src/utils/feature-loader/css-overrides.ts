import * as Flex from "@twilio/flex-ui";

var overrides = {};

export const init = (manager: Flex.Manager) => {
  manager.updateConfig({
    theme: {
      componentThemeOverrides: {
        ...overrides
      },
    },
  });
}

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  console.info(`Feature ${feature} registered CSS override hook: ${hook.cssOverrideHook.name}`);
  const override = hook.cssOverrideHook(flex, manager);
  overrides = {
    ...overrides,
    ...override
  };
}