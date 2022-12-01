import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { initialize } from "../../index";
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.activity_reservation_handler || {};

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  if (!enabled) return;

  console.log(`Feature enabled: activity-reservation-handler`);
  initialize();
};

export default pluginsLoadedHandler;
