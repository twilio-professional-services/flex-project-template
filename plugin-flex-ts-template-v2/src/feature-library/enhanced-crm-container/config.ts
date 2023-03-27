import { getFeatureFlags } from '../../utils/configuration';
import EnhancedCRMContainerConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.enhanced_crm_container as EnhancedCRMContainerConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
