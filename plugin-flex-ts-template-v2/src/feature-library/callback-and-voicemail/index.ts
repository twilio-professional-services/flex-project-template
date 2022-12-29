import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false, allow_requeue = false, max_attempts = 1, auto_select_task = false } = getFeatureFlags()?.features?.callbacks || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isAllowRequeueEnabled = () => {
  return enabled && allow_requeue;
};

export const isAutoSelectTaskEnabled = () => {
  return enabled && auto_select_task;
};

export const getMaxAttempts = () => {
  return max_attempts;
}
