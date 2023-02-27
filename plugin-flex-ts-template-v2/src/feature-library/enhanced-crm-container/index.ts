import { getFeatureFlags } from '../../utils/configuration';
import { FeatureDefinition } from "../../types/feature-loader";
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";
import EnhancedCRMContainerConfig from './types/ServiceConfiguration';

const { enabled = false } = getFeatureFlags()?.features?.enhanced_crm_container as EnhancedCRMContainerConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  return { name: "enhanced-crm-container", hooks: typeof hooks === 'undefined' ? [] : hooks };
};