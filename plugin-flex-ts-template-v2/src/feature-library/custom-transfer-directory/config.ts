import { getFeatureFlags } from '../../utils/configuration';

const {
  enabled = false,
  use_legacy_search_icon = false,
  queue: {
    enabled: queueEnabled = false,
    show_only_queues_with_available_workers = false,
    show_real_time_data = false,
    enforce_queue_filter_from_worker_object = false,
    enforce_global_filter = false,
    global_filter = '',
  },
  worker: { enabled: workerEnabled = false },
} = getFeatureFlags()?.features?.custom_transfer_directory || {};

export const isFeatureEnabled = (): boolean => {
  return enabled;
};

export const isCustomQueueTransferEnabled = (): boolean => {
  return isFeatureEnabled() && queueEnabled;
};

export const isCustomWorkerrTransferEnabled = (): boolean => {
  return isFeatureEnabled() && workerEnabled;
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
  return enforce_global_filter;
};

export const getGlobalFilter = (): string => {
  return global_filter;
};

export const shouldFetchInsightsData = (): boolean => {
  return showOnlyQueuesWithAvailableWorkers() || showRealTimeQueueData();
};

export const useLegactSearchIcon = (): boolean => {
  return use_legacy_search_icon;
};
