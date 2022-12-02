import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false, channel } = getFeatureFlags()?.features?.dual_channel_recording || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getChannelToRecord = () => {
  return channel;
};
