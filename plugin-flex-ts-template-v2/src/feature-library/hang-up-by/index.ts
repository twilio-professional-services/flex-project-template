import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false } = getFeatureFlags()?.features?.hang_up_by || {};

export const isFeatureEnabled = () => {
  return enabled;
};
