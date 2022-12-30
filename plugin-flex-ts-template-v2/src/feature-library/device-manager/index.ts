import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false } = getFeatureFlags()?.features?.device_manager || {};

export const isFeatureEnabled = () => {
  return enabled;
};
