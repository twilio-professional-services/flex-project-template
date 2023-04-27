export default interface CustomTransferDirectoryConfig {
  enabled: boolean;
  use_legacy_search_icon: boolean;
  worker: {
    enabled: boolean;
  };
  queue: {
    enabled: boolean;
    show_only_queues_with_available_workers: boolean;
    show_real_time_data: boolean;
    enforce_queue_filter_from_worker_object: boolean;
    enforce_global_filter: boolean;
    global_filter: string;
  };
}
