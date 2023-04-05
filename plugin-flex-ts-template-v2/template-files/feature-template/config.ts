import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false } = getFeatureFlags()?.features?.FEATURE_CONFIG_NAME || {};

export const isFeatureEnabled = () => {
  return enabled;
};
