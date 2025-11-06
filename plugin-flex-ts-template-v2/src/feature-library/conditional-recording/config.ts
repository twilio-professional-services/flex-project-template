import { getFeatureFlags, getLoadedFeatures } from '../../utils/configuration';
import ConditionalRecordingConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  exclude_attributes = [],
  exclude_queues = [],
} = (getFeatureFlags()?.features?.conditional_recording as ConditionalRecordingConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getExcludedAttributes = () => {
  return exclude_attributes;
};

export const getExcludedQueues = () => {
  return exclude_queues;
};

export const isDualChannelEnabled = () => {
  return getLoadedFeatures().includes('dual-channel-recording');
};
