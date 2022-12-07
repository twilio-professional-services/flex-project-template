import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false, rules } = getFeatureFlags()?.features?.supervisor_capacity || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getRules = () => {
  return rules;
};
