import * as Flex from "@twilio/flex-ui";
import CustomFilters from "./filters";

export default async (flex: typeof Flex, manager: Flex.Manager) => {
  
  const { roles } = manager.user;
  const loadFilters = roles.indexOf("supervisor") >= 0 || roles.indexOf("admin") >= 0;
  
  if (!loadFilters) return;
  
  const customFilters = await CustomFilters();
  Flex.TeamsView.defaultProps.filters = [
    Flex.TeamsView.activitiesFilter,
    ...customFilters
  ];

};
