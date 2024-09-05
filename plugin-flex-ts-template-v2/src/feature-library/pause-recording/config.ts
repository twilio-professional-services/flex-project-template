import { getFeatureFlags, getLoadedFeatures } from '../../utils/configuration';
import PauseRecordingConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  indicator_permanent = false,
  indicator_banner = false,
  include_silence = false,
} = (getFeatureFlags()?.features?.pause_recording as PauseRecordingConfig) || {};

const { channel = 'worker' } = getFeatureFlags()?.features?.dual_channel_recording || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isBannerIndicatorEnabled = () => {
  return enabled && indicator_banner;
};

export const isPermanentIndicatorEnabled = () => {
  return enabled && indicator_permanent;
};

export const isIncludeSilenceEnabled = () => {
  return enabled && include_silence;
};

export const isDualChannelEnabled = () => {
  return getLoadedFeatures().includes('dual-channel-recording');
};

export const getChannelToRecord = () => {
  return channel.toLowerCase();
};
