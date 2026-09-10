import { getFeatureFlags } from '../../utils/configuration';
import MassWorkerUpdateConfig from './types/ServiceConfiguration';

const DEFAULT_SYNC_DOC_NAME = 'mass_worker_update_state';
const DEFAULT_STALE_HEARTBEAT_MS = 20000;
const DEFAULT_MAX_WORKERS_PER_RUN = 100;

const {
  enabled = false,
  sync_doc_name = DEFAULT_SYNC_DOC_NAME,
  stale_heartbeat_ms = DEFAULT_STALE_HEARTBEAT_MS,
  max_workers_per_run = DEFAULT_MAX_WORKERS_PER_RUN,
} = (getFeatureFlags()?.features?.mass_worker_update as MassWorkerUpdateConfig) || {};

export const isFeatureEnabled = () => enabled;
export const getSyncDocName = () => sync_doc_name;
export const getStaleHeartbeatMs = () => stale_heartbeat_ms;
export const getMaxWorkersPerRun = () => max_workers_per_run;
