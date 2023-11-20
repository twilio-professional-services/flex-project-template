import { getFeatureFlags } from '../../utils/configuration';
import DispositionsConfig, { CustomAttribute, WrapUpConfig, SelectAttribute } from './types/ServiceConfiguration';

const {
  enabled = false,
  enable_notes = false,
  require_disposition = false,
  global = {} as WrapUpConfig,
  per_queue = {},
} = (getFeatureFlags()?.features?.dispositions as DispositionsConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isNotesEnabled = () => {
  return isFeatureEnabled() && enable_notes;
};

export const isRequireDispositionEnabledForQueue = (queueSid: string, queueName: string) => {
  if (!isFeatureEnabled()) return false;

  let required = require_disposition;
  if (
    queueSid &&
    per_queue[queueSid] &&
    (per_queue[queueSid].require_disposition === true || per_queue[queueSid].require_disposition === false)
  ) {
    required = per_queue[queueSid].require_disposition;
  }
  if (
    queueName &&
    per_queue[queueName] &&
    (per_queue[queueName].require_disposition === true || per_queue[queueName].require_disposition === false)
  ) {
    required = per_queue[queueName].require_disposition;
  }

  return required;
};

export const getDispositionsForQueue = (queueSid: string, queueName: string): string[] => {
  if (!isFeatureEnabled()) return [];

  let dispositions = [...global.dispositions];

  if (queueSid && per_queue[queueSid] && per_queue[queueSid].dispositions) {
    dispositions = [...dispositions, ...per_queue[queueSid].dispositions];
  }
  if (queueName && per_queue[queueName] && per_queue[queueName].dispositions) {
    dispositions = [...dispositions, ...per_queue[queueName].dispositions];
  }

  return dispositions;
};

export const getTextAttributes = (queueName: string): CustomAttribute[] => {
  let text_attributes = [...global.text_attributes];
  if (queueName && per_queue[queueName] && per_queue[queueName].text_attributes) {
    text_attributes = [...text_attributes, ...per_queue[queueName].text_attributes];
  }
  return text_attributes;
};

export const getSelectAttributes = (queueName: string): SelectAttribute[] => {
  let select_attributes = [...global.select_attributes];
  if (queueName && per_queue[queueName] && per_queue[queueName].select_attributes) {
    select_attributes = [...select_attributes, ...per_queue[queueName].select_attributes];
  }
  return select_attributes;
};

export const getMultiSelectGroup = (): SelectAttribute => {
  return global.multi_select_group as SelectAttribute;
};

export const getQueueMultiSelectGroup = (queueName: string): SelectAttribute => {
  let queueMultiSelectGroup = {} as SelectAttribute;
  if (queueName && per_queue[queueName] && per_queue[queueName].multi_select_group) {
    queueMultiSelectGroup = per_queue[queueName].multi_select_group;
  }
  return queueMultiSelectGroup;
};
