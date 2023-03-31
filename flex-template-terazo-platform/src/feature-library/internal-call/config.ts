import { getFeatureFlags } from '../../utils/configuration';
import InternalCallConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.internal_call as InternalCallConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
