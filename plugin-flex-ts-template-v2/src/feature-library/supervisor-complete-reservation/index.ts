import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false } = getFeatureFlags()?.features?.supervisor_complete_reservation || {};

export const isFeatureEnabled = () => {
  return enabled;
};


