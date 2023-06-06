import { getFeatureFlags } from '../../utils/configuration';
import LocalizationConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.localization as LocalizationConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
