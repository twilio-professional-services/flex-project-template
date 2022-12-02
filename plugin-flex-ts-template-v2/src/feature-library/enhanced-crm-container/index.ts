import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false } = getFeatureFlags()?.features?.enhanced_crm_container || {};

export const isFeatureEnabled = () => {
  return enabled;
};
