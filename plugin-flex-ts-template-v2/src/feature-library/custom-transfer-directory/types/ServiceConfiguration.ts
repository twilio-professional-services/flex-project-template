export default interface CustomTransferDirectoryConfig {
  enabled: boolean;
  use_paste_search_icon: boolean;
  queue: {
    enabled: boolean;
    show_only_queues_with_available_workers: boolean;
    show_real_time_data: boolean;
    enforce_queue_filter_from_worker_object: boolean;
    enforce_global_exclude_filter: boolean;
    global_exclude_filter: string;
  };
  external_directory: {
    enabled: boolean;
    skipPhoneNumberValidation: boolean;
    directory: Array<ExternalDirectoryEntry>;
  };
}

export interface ExternalDirectoryEntry {
  cold_transfer_enabled: boolean;
  warm_transfer_enabled: boolean;
  label: string;
  number: string;
}
