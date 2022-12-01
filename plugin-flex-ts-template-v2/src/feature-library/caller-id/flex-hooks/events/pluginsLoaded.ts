import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.caller_id || {};

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  if (!enabled) return;

  console.log(`Feature enabled: caller-id`);
};

export default pluginsLoadedHandler;
