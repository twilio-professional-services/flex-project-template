import { Manager } from '@twilio/flex-ui';

import { getFeatureFlags, getFlexFeatureFlag, getLoadedFeatures } from '../../utils/configuration';
import { ExternalDirectoryEntry } from './types/DirectoryEntry';
import CustomTransferDirectoryConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  max_items = 200,
  queue: queue_config,
  worker: worker_config,
  external_directory: external_directory_config,
} = (getFeatureFlags()?.features?.custom_transfer_directory as CustomTransferDirectoryConfig) || {};

const {
  enabled: queueEnabled = false,
  show_only_queues_with_available_workers = false,
  show_real_time_data = false,
  enforce_queue_filter_from_worker_object = false,
  enforce_global_exclude_filter = false,
  global_exclude_filter = '',
} = queue_config || {};

const {
  enabled: workerEnabled = false,
  show_only_available_workers = false,
  max_taskrouter_workers = 15000,
} = worker_config || {};

const {
  enabled: externalDirectoryEnabled = false,
  skipPhoneNumberValidation = false,
  directory = [] as Array<ExternalDirectoryEntry>,
} = external_directory_config || {};

const {
  cold_transfer: conversation_transfer_cold_transfer = false,
  multi_participant: conversation_transfer_warm_transfer = false,
} = getFeatureFlags()?.features?.conversation_transfer || {};

const nativeXwtEnabled = getFlexFeatureFlag('external-warm-transfers');

export const isFeatureEnabled = (): boolean => {
  return enabled;
};

export const getMaxItems = (): number => {
  return max_items;
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
  return (
    isNativeDigitalXferEnabled() ||
    (getLoadedFeatures().includes('conversation-transfer') && conversation_transfer_cold_transfer)
  );
};

export const isCbmWarmTransferEnabled = (): boolean => {
  return getLoadedFeatures().includes('conversation-transfer') && conversation_transfer_warm_transfer;
};

export const isExternalDirectoryEnabled = (): boolean => {
  return isFeatureEnabled() && externalDirectoryEnabled;
};

export const getExternalDirectory = (): Array<ExternalDirectoryEntry> => {
  return directory;
};

export const isVoiceXWTEnabled = () => {
  return getLoadedFeatures().includes('conference') || nativeXwtEnabled;
};

export const shouldSkipPhoneNumberValidation = () => {
  return skipPhoneNumberValidation;
};

export const isCustomWorkerTransferEnabled = (): boolean => {
  return isFeatureEnabled() && workerEnabled;
};

export const showOnlyAvailableWorkers = (): boolean => {
  return show_only_available_workers;
};

export const getMaxTaskRouterWorkers = (): number => {
  return max_taskrouter_workers;
};

export const isNativeDigitalXferEnabled = (): boolean => {
  return Manager.getInstance().store.getState().flex.featureFlags?.transfersConfig?.enabled === true;
};
