import { getFeatureFlags } from '../../utils/configuration';
import SupervisorCapacityConfig from './types/ServiceConfiguration';

const { enabled = false, rules } = (getFeatureFlags()?.features?.supervisor_capacity as SupervisorCapacityConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getRules = () => {
  return rules;
};
