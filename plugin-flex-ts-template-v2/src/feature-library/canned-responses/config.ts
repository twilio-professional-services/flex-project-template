import { getFeatureFlags, loadedFeatures } from '../../utils/configuration';
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
  return loadedFeatures.includes('enhanced-crm-container');
};
