export default interface CustomTransferDirectoryConfig {
  enabled: boolean;
  use_legacy_search_icon: boolean;
  worker: {
    enabled: boolean;
  };
  queue: {
    enabled: boolean;
    show_only_queues_with_available_workers: boolean;
  };
}
