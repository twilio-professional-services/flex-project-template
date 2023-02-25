import { getFeatureFlags } from '../../utils/configuration';
import DualChannelRecordingConfig from './types/ServiceConfiguration';
import { loadFeature } from '../../utils/feature-loader';
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";

const { enabled = false, channel } = getFeatureFlags()?.features?.dual_channel_recording as DualChannelRecordingConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getChannelToRecord = () => {
  return channel;
};

export const register = () => {
  if (!isFeatureEnabled()) return;
  loadFeature("dual-channel-recording", hooks);
};
