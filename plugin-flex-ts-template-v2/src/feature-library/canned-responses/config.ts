import { getFeatureFlags, getLoadedFeatures } from '../../utils/configuration';
import CannedResponsesConfig from './types/ServiceConfiguration';

const { enabled = false, location = 'CRM' } =
  (getFeatureFlags()?.features?.canned_responses as CannedResponsesConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getUILocation = () => {
  return location;
};

export const isEnhancedCRMEnabled = () => {
  return getLoadedFeatures().includes('enhanced-crm-container');
};
