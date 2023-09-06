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

  if (customFilters.length < 1) {
    // If no teams view filter hooks, let's use the default set.
    return;
  }

  flex.TeamsView.defaultProps.filters = customFilters;

  // Because some filters may be async, the default filters will not apply automatically.
  const defaultFilters = customFilters
    .filter((filter) => filter.options && filter.options.filter((option) => option.default).length)
    .map((filter) => ({
      name: filter.id,
      condition: (filter.condition as Flex.FilterConditions) || Flex.FilterConditions.IN,
      values: filter.options?.filter((option) => option.default).map((option) => option.value) || [],
    }));
  if (!defaultFilters.length) return;
  Flex.Actions.invokeAction('ApplyTeamsViewFilters', {
    filters: defaultFilters,
  });
};

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  console.info(`Feature ${feature} registered teams filter hook: %c${hook.teamsFilterHook.name}`, 'font-weight:bold');
  teamsFilterHooks.push(hook);
};
