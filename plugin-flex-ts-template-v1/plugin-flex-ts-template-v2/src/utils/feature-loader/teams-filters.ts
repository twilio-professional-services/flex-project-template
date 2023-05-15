import * as Flex from '@twilio/flex-ui';

const teamsFilterHooks = [] as any[];

let customFilters = [] as Array<Flex.FilterDefinition>;

export const init = async (flex: typeof Flex, manager: Flex.Manager) => {
  for (const hook of teamsFilterHooks) {
    // Returns array of filter definitions to register
    // We do this here instead of during addHook due to the need for async
    const hookFilters = await hook.teamsFilterHook(flex, manager);
    customFilters = customFilters.concat(hookFilters);
  }

  flex.TeamsView.defaultProps.filters = [flex.TeamsView.activitiesFilter, ...customFilters];
};

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  console.info(`Feature ${feature} registered teams filter hook: %c${hook.teamsFilterHook.name}`, 'font-weight:bold');
  teamsFilterHooks.push(hook);
};
