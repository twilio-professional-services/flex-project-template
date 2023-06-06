import { getFeatureFlags } from '../../utils/configuration';
import LocalizationConfig from './types/ServiceConfiguration';

const { enabled = false, show_menu = true } = (getFeatureFlags()?.features?.localization as LocalizationConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isMenuEnabled = () => {
  return show_menu;
};
