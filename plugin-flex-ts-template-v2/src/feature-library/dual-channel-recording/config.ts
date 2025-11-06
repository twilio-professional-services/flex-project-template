import { getFeatureFlags } from '../../utils/configuration';
import DualChannelRecordingConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  channel,
  exclude_attributes = [],
  exclude_queues = [],
} = (getFeatureFlags()?.features?.dual_channel_recording as DualChannelRecordingConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getChannelToRecord = () => {
  return channel;
};

export const getExcludedAttributes = () => {
  return exclude_attributes;
};

export const getExcludedQueues = () => {
  return exclude_queues;
};
