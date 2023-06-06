import { Manager } from '@twilio/flex-ui';

import { getFeatureFlags } from '../../utils/configuration';
import { ExternalDirectoryEntry } from './types/ServiceConfiguration';

const { enabled = false, use_paste_search_icon = false } = getFeatureFlags()?.features?.custom_transfer_directory || {};

const {
  enabled: queueEnabled = false,
  show_only_queues_with_available_workers = false,
  show_real_time_data = false,
  enforce_queue_filter_from_worker_object = false,
  enforce_global_exclude_filter = false,
  global_exclude_filter = '',
} = getFeatureFlags()?.features?.custom_transfer_directory?.queue || {};

const {
  enabled: externalDirectoryEnabled = false,
  skipPhoneNumberValidation = false,
  directory = [] as Array<ExternalDirectoryEntry>,
} = getFeatureFlags()?.features?.custom_transfer_directory?.external_directory || {};

const {
  enabled: conversation_transfer_enabled = false,
  cold_transfer: conversation_transfer_cold_transfer = false,
  multi_participant: conversation_transfer_warm_transfer = false,
} = getFeatureFlags()?.features?.conversation_transfer || {};

const { enabled: conference_enabled = false } = getFeatureFlags()?.features?.conference || {};

const nativeXwtEnabled =
  Manager.getInstance().store.getState().flex.featureFlags.features['external-warm-transfers']?.enabled === true;

export const isFeatureEnabled = (): boolean => {
  return enabled;
};

export const isCustomQueueTransferEnabled = (): boolean => {
  return isFeatureEnabled() && queueEnabled;
};

export const showOnlyQueuesWithAvailableWorkers = (): boolean => {
  return show_only_queues_with_available_workers;
};

export const showRealTimeQueueData = (): boolean => {
  return show_real_time_data;
};

export const enforceQueueFilterFromWorker = (): boolean => {
  return enforce_queue_filter_from_worker_object;
};

export const shouldEnforceGlobalFilter = (): boolean => {
  return enforce_global_exclude_filter;
};

export const getGlobalFilter = (): string => {
  return global_exclude_filter;
};

export const shouldFetchInsightsData = (): boolean => {
  return showOnlyQueuesWithAvailableWorkers() || showRealTimeQueueData();
};

export const isCbmColdTransferEnabled = (): boolean => {
  return conversation_transfer_enabled && conversation_transfer_cold_transfer;
};

export const isCbmWarmTransferEnabled = (): boolean => {
  return conversation_transfer_enabled && conversation_transfer_warm_transfer;
};

export const usePasteSearchIcon = (): boolean => {
  return use_paste_search_icon;
};

export const isExternalDirectoryEnabled = (): boolean => {
  return isFeatureEnabled() && externalDirectoryEnabled;
};

export const getExternalDirectory = (): Array<ExternalDirectoryEntry> => {
  return directory;
};

export const isVoiceXWTEnabled = () => {
  return conference_enabled || nativeXwtEnabled;
};

export const shouldSkipPhoneNumberValidation = () => {
  return skipPhoneNumberValidation;
};
