import { getFeatureFlags } from '../../utils/configuration';
import DispositionsConfig, { CustomAttribute, GlobalConfig, SelectAttribute } from './types/ServiceConfiguration';

const {
  enabled = false,
  enable_notes = false,
  require_disposition = false,
  global = {} as GlobalConfig,
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

  let dispositions = [...global.dispositions];

  if (queueSid && per_queue[queueSid] && per_queue[queueSid].dispositions) {
    dispositions = [...dispositions, ...per_queue[queueSid].dispositions];
  }

  return dispositions;
};

export const getTextAttributes = (queueSid: string): CustomAttribute[] => {
  let text_attributes = [...global.text_attributes];
  if (queueSid && per_queue[queueSid] && per_queue[queueSid].text_attributes) {
    text_attributes = [...text_attributes, ...per_queue[queueSid].text_attributes];
  }
  return text_attributes;
};

export const getSelectAttributes = (queueSid: string): SelectAttribute[] => {
  let select_attributes = [...global.select_attributes];
  if (queueSid && per_queue[queueSid] && per_queue[queueSid].select_attributes) {
    select_attributes = [...select_attributes, ...per_queue[queueSid].select_attributes];
  }
  return select_attributes;
};

export const getMultiSelectGroup = (): SelectAttribute => {
  return global.multi_select_group as SelectAttribute;
};
