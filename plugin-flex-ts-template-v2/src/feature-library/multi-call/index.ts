import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false } = getFeatureFlags()?.features?.multi_call || {};

export const isFeatureEnabled = () => {
  return enabled;
};
