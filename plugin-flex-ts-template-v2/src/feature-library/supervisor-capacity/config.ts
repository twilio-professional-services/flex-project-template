import { getFeatureFlags, getLoadedFeatures } from '../../utils/configuration';
import SupervisorCapacityConfig from './types/ServiceConfiguration';

const { enabled = false, rules } = (getFeatureFlags()?.features?.supervisor_capacity as SupervisorCapacityConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getRules = () => {
  return rules;
};

export const isWorkerCanvasTabsEnabled = () => {
  return getLoadedFeatures().includes('worker-canvas-tabs');
};
