import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false } = getFeatureFlags()?.features?.internal_call || {};

export const isFeatureEnabled = () => {
  return enabled;
};
