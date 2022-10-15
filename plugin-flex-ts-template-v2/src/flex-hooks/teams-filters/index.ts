import * as Flex from "@twilio/flex-ui";
import TeamViewFiltersToregister from "./TeamFilters";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  TeamViewFiltersToregister.forEach((TeamViewFiltersToregister) => {
    TeamViewFiltersToregister(flex, manager);
  });
};
