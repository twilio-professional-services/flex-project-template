export default interface DispositionsConfig {
  enabled: boolean;
  enable_notes: boolean;
  require_disposition: boolean;
  global_dispositions: string[];
  per_queue: { [key: string]: DispositionsPerQueueConfig };
}

export interface DispositionsPerQueueConfig {
  require_disposition: boolean;
  dispositions: string[];
}
