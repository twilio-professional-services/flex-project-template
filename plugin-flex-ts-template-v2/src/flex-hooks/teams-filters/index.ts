import * as Flex from "@twilio/flex-ui";
import Filters from "./filters";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  Flex.TeamsView.defaultProps.filters = [
    Flex.TeamsView.activitiesFilter,
    ...Filters
  ];
};
