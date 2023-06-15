import { getFeatureFlags } from '../../utils/configuration';
import ParkInteractionConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.park_interaction as ParkInteractionConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
