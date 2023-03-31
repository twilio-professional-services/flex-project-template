import { getFeatureFlags } from '../../utils/configuration';
import OmniChannelCapacityManagementConfig from './types/ServiceConfiguration';

const { enabled = false } =
  (getFeatureFlags()?.features?.omni_channel_capacity_management as OmniChannelCapacityManagementConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
