import { getFeatureFlags } from '../../utils/configuration';
import { loadFeature } from '../../utils/feature-loader';
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";
import EnhancedCRMContainerConfig from './types/ServiceConfiguration';

const { enabled = false } = getFeatureFlags()?.features?.enhanced_crm_container as EnhancedCRMContainerConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = () => {
  if (!isFeatureEnabled()) return;
  loadFeature("enhanced-crm-container", hooks);
};