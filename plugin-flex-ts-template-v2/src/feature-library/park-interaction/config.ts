import { getFeatureFlags } from '../../utils/configuration';
import ParkInteractionConfig from './types/ServiceConfiguration';

const { enabled = false, show_menu = false } =
  (getFeatureFlags()?.features?.park_interaction as ParkInteractionConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isMenuEnabled = () => {
  return show_menu;
};
