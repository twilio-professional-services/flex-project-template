import { getFeatureFlags } from '../../utils/configuration';
import OmniChannelCapacityManagementConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  channel = 'chat',
  default_max_capacity = 2,
} = (getFeatureFlags()?.features?.omni_channel_capacity_management as OmniChannelCapacityManagementConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getConfigChannel = () => {
  return channel;
};

export const getDefaultMaxCapacity = () => {
  return default_max_capacity;
};
