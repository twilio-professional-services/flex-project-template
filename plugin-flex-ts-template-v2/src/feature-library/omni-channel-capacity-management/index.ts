import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false } = getFeatureFlags()?.features?.omni_channel_capacity_management || {};

export const isFeatureEnabled = () => {
  return enabled;
};
