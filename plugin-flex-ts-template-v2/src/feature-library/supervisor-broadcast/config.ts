import { getFeatureFlags } from '../../utils/configuration';
import SupervisorBroadcastConfig from './types/ServiceConfiguration';

const { enabled = true } = (getFeatureFlags()?.features?.supervisor_broadcast as SupervisorBroadcastConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
