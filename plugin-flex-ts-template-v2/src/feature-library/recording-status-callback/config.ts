import { getFeatureFlags } from '../../utils/configuration';
import RecordingStatusCallbackConfig from './types/ServiceConfiguration';
import { replaceStringAttributes } from '../../utils/helpers';
import { ITask } from '@twilio/flex-ui';

const {
  enabled = false,
  callback_url = '',
  notify_absent = false,
  notify_completed = true,
  notify_inprogress = false,
} = (getFeatureFlags()?.features?.recording_status_callback as RecordingStatusCallbackConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getCallbackUrl = (task?: ITask) => {
  if (callback_url) {
    return replaceStringAttributes(callback_url, task);
  }
  return '';
};

export const isNotifyAbsentEnabled = () => {
  return notify_absent;
};

export const isNotifyCompletedEnabled = () => {
  return notify_completed;
};

export const isNotifyInProgressEnabled = () => {
  return notify_inprogress;
};