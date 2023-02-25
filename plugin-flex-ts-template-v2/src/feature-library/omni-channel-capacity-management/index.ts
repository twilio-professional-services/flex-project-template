import { getFeatureFlags } from '../../utils/configuration';
import OmniChannelCapacityManagementConfig from './types/ServiceConfiguration';
import { loadFeature } from '../../utils/feature-loader';
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";

const { enabled = false } = getFeatureFlags()?.features?.omni_channel_capacity_management as OmniChannelCapacityManagementConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = () => {
  if (!isFeatureEnabled()) return;
  loadFeature("omni-channel-capacity-management", hooks);
};
