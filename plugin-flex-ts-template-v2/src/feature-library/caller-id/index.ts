import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false } = getFeatureFlags()?.features?.caller_id || {};

export const isFeatureEnabled = () => {
  return enabled;
};
