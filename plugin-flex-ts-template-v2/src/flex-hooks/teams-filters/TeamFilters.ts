import * as Flex from "@twilio/flex-ui";
import ConfiguredTemplateTeamFilters from "../../feature-library/teams-view-filters/flex-hooks/team-filters/TeamFilters";

const TeamViewFiltersToregister: ((
  flex: typeof Flex,
  manager: Flex.Manager
) => void)[] = [ConfiguredTemplateTeamFilters];

export default TeamViewFiltersToregister;
