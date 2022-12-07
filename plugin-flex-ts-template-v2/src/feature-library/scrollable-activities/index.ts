import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false } = getFeatureFlags()?.features?.scrollable_activities || {};

export const isFeatureEnabled = () => {
  return enabled;
};
