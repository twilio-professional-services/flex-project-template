import { getFeatureFlags } from '../../utils/configuration';
import MultiCallConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.multi_call as MultiCallConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
