import { FilterDefinition } from "@twilio/flex-ui";
import getSampleFilters from "../../feature-library/teams-view-filters/flex-hooks/team-filters/TeamFilters";

var filters = [] as Array<FilterDefinition>;

const getFilters = async () => {
  var sampleFilters = await getSampleFilters();
  filters.push(...sampleFilters);
  return filters;
}

export default getFilters;
