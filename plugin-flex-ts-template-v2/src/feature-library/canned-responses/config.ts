import { getFeatureFlags } from '../../utils/configuration';
import CannedResponsesConfig from './types/ServiceConfiguration';

const { enabled = false, location = 'CRM' } =
  (getFeatureFlags()?.features?.canned_responses as CannedResponsesConfig) || {};

const { enabled: enhancedCRMEnabled = false } = getFeatureFlags()?.features?.enhanced_crm_container || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getUILocation = () => {
  return location;
};

export const isEnhancedCRMEnabled = () => {
  return enhancedCRMEnabled;
};
