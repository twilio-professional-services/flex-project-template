import * as Flex from "@twilio/flex-ui";
import CustomFilters from "./filters";

export default async (flex: typeof Flex, manager: Flex.Manager) => {
  
  const customFilters = await CustomFilters();
  Flex.TeamsView.defaultProps.filters = [
    Flex.TeamsView.activitiesFilter,
    ...customFilters
  ];

};
