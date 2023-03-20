import { getFeatureFlags } from '../../utils/configuration';
import CallerIdConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.caller_id as CallerIdConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
