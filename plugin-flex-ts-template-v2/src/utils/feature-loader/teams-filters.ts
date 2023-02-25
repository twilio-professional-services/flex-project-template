import * as Flex from "@twilio/flex-ui";

var customFilters = [] as Array<Flex.FilterDefinition>;

export const init = (flex: typeof Flex) => {
  flex.TeamsView.defaultProps.filters = [
    flex.TeamsView.activitiesFilter,
    ...customFilters
  ];
}

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  console.info(`Feature ${feature} registered teams filter hook: %c${hook.teamsFilterHook.name}`, 'font-weight:bold');
  // Returns array of filter definitions to register
  const hookFilters = hook.teamsFilterHook(flex, manager);
  customFilters = customFilters.concat(hookFilters);
}