import * as Flex from "@twilio/flex-ui";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { UIAttributes } from "types/manager/ServiceConfiguration";

import { enabledFilters } from "../../enabledFilters";

const { custom_data } =
  (Flex.Manager.getInstance().serviceConfiguration
    .ui_attributes as UIAttributes) || {};
const { enabled = false } =
  custom_data?.features?.teams_view_filters || {};

const pluginsLoadedHandler = async (flexEvent: FlexEvent) => {
  if (!enabled) return;

  console.log(`Feature enabled: teams-view-filters`);
  
  Flex.TeamsView.defaultProps.filters = [
    Flex.TeamsView.activitiesFilter,
    ...enabledFilters
  ];
};

export default pluginsLoadedHandler;
