import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.conference || {};

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  if (!enabled) return;

  console.log(`Feature enabled: conference`);
};

export default pluginsLoadedHandler;
