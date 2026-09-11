import { getFeatureFlags } from '../../utils/configuration';
import MassWorkerUpdateConfig from './types/ServiceConfiguration';

const DEFAULT_SYNC_DOC_NAME = 'mass_worker_update_state';
const DEFAULT_STALE_HEARTBEAT_MS = 20000;
const DEFAULT_MAX_WORKERS_PER_RUN = 100;
const DEFAULT_BATCH_SIZE = 5;
const MIN_BATCH_SIZE = 1;
const MAX_BATCH_SIZE = 25;

const {
  enabled = false,
  sync_doc_name = DEFAULT_SYNC_DOC_NAME,
  stale_heartbeat_ms = DEFAULT_STALE_HEARTBEAT_MS,
  max_workers_per_run = DEFAULT_MAX_WORKERS_PER_RUN,
  batch_size = DEFAULT_BATCH_SIZE,
} = (getFeatureFlags()?.features?.mass_worker_update as MassWorkerUpdateConfig) || {};

export const isFeatureEnabled = () => enabled;
export const getSyncDocName = () => sync_doc_name;
export const getStaleHeartbeatMs = () => stale_heartbeat_ms;
export const getMaxWorkersPerRun = () => max_workers_per_run;

/**
 * Effective batch size clamped to [MIN_BATCH_SIZE, MAX_BATCH_SIZE]. The
 * server clamps again defensively, so this is primarily to keep the value
 * sensible in the request payload.
 */
export const getBatchSize = () => {
  const raw = typeof batch_size === 'number' && Number.isFinite(batch_size) ? batch_size : DEFAULT_BATCH_SIZE;
  const rounded = Math.floor(raw);
  return Math.min(MAX_BATCH_SIZE, Math.max(MIN_BATCH_SIZE, rounded));
};
