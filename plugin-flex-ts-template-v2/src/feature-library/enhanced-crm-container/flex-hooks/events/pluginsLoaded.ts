import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.enhanced_crm_container || {};

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  if (!enabled) return;

  console.log(`Feature enabled: enhanced-crm-container`);
};

export default pluginsLoadedHandler;
