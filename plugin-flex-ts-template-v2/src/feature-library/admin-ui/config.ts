import { getFeatureFlags } from '../../utils/configuration';
import AdminUiConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.admin_ui as AdminUiConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
