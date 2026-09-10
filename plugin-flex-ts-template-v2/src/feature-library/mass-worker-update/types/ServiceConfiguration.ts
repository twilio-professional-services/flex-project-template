export default interface MassWorkerUpdateConfig {
  enabled: boolean;
  sync_doc_name?: string;
  stale_heartbeat_ms?: number;
  max_workers_per_run?: number;
}
