import { ExternalDirectoryEntry } from './DirectoryEntry';

export default interface CustomTransferDirectoryConfig {
  enabled: boolean;
  worker: {
    enabled: boolean;
    show_only_available_workers: boolean;
  };
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
