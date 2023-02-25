import { getFeatureFlags } from '../../utils/configuration';
import { loadFeature } from '../../utils/feature-loader';
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";

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

export const register = () => {
  if (!isFeatureEnabled()) return;
  loadFeature("callback-and-voicemail", hooks);
};
