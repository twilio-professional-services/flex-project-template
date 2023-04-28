import { getFeatureFlags } from '../../utils/configuration';
import FEATURE_CLASS_NAMEConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.FEATURE_CONFIG_NAME as FEATURE_CLASS_NAMEConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
