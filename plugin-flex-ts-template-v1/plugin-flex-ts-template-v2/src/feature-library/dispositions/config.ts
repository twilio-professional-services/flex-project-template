import { getFeatureFlags } from '../../utils/configuration';
import DispositionsConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  enable_notes = false,
  require_disposition = false,
  global_dispositions = [],
  per_queue = {},
} = (getFeatureFlags()?.features?.dispositions as DispositionsConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isNotesEnabled = () => {
  return isFeatureEnabled() && enable_notes;
};

export const isRequireDispositionEnabledForQueue = (queueSid: string) => {
  if (!isFeatureEnabled()) return false;

  let required = require_disposition;

  if (
    queueSid &&
    per_queue[queueSid] &&
    (per_queue[queueSid].require_disposition === true || per_queue[queueSid].require_disposition === false)
  ) {
    required = per_queue[queueSid].require_disposition;
  }

  return required;
};

export const getDispositionsForQueue = (queueSid: string): string[] => {
  if (!isFeatureEnabled()) return [];

  let dispositions = [...global_dispositions];

  if (queueSid && per_queue[queueSid] && per_queue[queueSid].dispositions) {
    dispositions = [...dispositions, ...per_queue[queueSid].dispositions];
  }

  return dispositions;
};
