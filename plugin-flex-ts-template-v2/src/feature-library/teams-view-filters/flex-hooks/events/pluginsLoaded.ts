import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { isFeatureEnabled } from "../../index";

const pluginsLoadedHandler = async (flexEvent: FlexEvent) => {
  if (!isFeatureEnabled()) return;

  console.log(`Feature enabled: teams-view-filters`);

};

export default pluginsLoadedHandler;
