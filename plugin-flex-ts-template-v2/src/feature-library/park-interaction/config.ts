import { getFeatureFlags } from '../../utils/configuration';
import ParkInteractionConfig from './types/ServiceConfiguration';

const { enabled = false, show_list = false } =
  (getFeatureFlags()?.features?.park_interaction as ParkInteractionConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isListEnabled = () => {
  return show_list;
};
