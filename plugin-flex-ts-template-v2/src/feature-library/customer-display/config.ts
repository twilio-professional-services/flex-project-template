import { getFeatureFlags } from '../../utils/configuration';
import CustomerDisplayConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.customer_display as CustomerDisplayConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
