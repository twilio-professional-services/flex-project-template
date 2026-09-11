export default interface MassWorkerUpdateConfig {
  enabled: boolean;
  sync_doc_name?: string;
  stale_heartbeat_ms?: number;
  max_workers_per_run?: number;
  /**
   * How many worker updates the serverless loop fires concurrently. Clamped
   * to [1, 25]; a value of 1 restores the sequential behavior. Larger values
   * cut wall-time but coarsen cancel latency (a cancel arriving mid-batch
   * only takes effect at the next batch boundary).
   */
  batch_size?: number;
}
