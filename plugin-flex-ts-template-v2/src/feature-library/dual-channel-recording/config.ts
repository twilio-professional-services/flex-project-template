import { getFeatureFlags } from '../../utils/configuration';
import DualChannelRecordingConfig from './types/ServiceConfiguration';

const { enabled = false, channel } =
  (getFeatureFlags()?.features?.dual_channel_recording as DualChannelRecordingConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getChannelToRecord = () => {
  return channel;
};
