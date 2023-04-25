export default interface DispositionsConfig {
  enabled: boolean;
  enable_notes: boolean;
  require_disposition: boolean;
  global_dispositions: string[];
  per_queue_dispositions: { [key: string]: string[] };
}
