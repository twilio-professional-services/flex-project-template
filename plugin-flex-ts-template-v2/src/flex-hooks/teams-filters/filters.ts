import * as Flex from "@twilio/flex-ui";
import getSampleFilters from "../../feature-library/teams-view-filters/flex-hooks/team-filters/TeamFilters";

var sampleFilters = await getSampleFilters();

const filters = [...sampleFilters]

export default filters;
