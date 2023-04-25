import { getFeatureFlags } from '../../utils/configuration';
import DispositionsConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  enable_notes = false,
  require_disposition = false,
  global_dispositions = [],
  per_queue_dispositions = {},
} = (getFeatureFlags()?.features?.dispositions as DispositionsConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isNotesEnabled = () => {
  return isFeatureEnabled() && enable_notes;
};

export const isRequireDispositionEnabled = () => {
  return isFeatureEnabled() && require_disposition;
};

export const getDispositionsForQueue = (queueSid: string): string[] => {
  if (!isFeatureEnabled()) return [];

  let dispositions = [...global_dispositions];

  if (queueSid && per_queue_dispositions[queueSid]) {
    dispositions = [...dispositions, ...per_queue_dispositions[queueSid]];
  }

  return dispositions;
};
