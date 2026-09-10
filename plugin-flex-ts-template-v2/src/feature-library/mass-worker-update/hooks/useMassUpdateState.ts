import { useCallback, useEffect, useState } from 'react';

import SyncClient from '../../../utils/sdk-clients/sync/SyncClient';
import logger from '../../../utils/logger';
import { getSyncDocName, getStaleHeartbeatMs } from '../config';
import { MassUpdateState } from '../types/mass-worker-update';

const DEFAULT_STATE: MassUpdateState = {
  inProgress: false,
  startedBy: null,
  startedAt: null,
  total: 0,
  processed: 0,
  cancelled: false,
  heartbeatAt: null,
  error: null,
};

/**
 * Subscribes to the shared mass-worker-update Sync Document and exposes:
 * - `state`: the current MassUpdateState (falls back to a not-in-progress default)
 * - `isStale`: true when the doc claims `inProgress` but heartbeat is older than
 *   `stale_heartbeat_ms`. Used to surface the Reset affordance when the server
 *   function timed out mid-loop.
 * - `cancel`: writes `{ ...current, cancelled: true }` to the doc. Any admin on
 *   this screen can call it.
 * - `tick`: an ever-incrementing counter that re-evaluates `isStale` at least
 *   once a second so the popup transitions to Stale without needing a doc write.
 */
export const useMassUpdateState = () => {
  const [state, setState] = useState<MassUpdateState>(DEFAULT_STATE);
  const [tick, setTick] = useState(0);
  const [docRef, setDocRef] = useState<any>(null);

  useEffect(() => {
    let doc: any = null;
    let cancelled = false;

    (async () => {
      try {
        doc = await SyncClient.document(getSyncDocName());
        if (cancelled) return;
        setDocRef(doc);
        setState({ ...DEFAULT_STATE, ...((doc.data as Partial<MassUpdateState>) || {}) });
        doc.on('updated', (event: any) => {
          const nextData = (event && 'data' in event ? event.data : doc.data) as Partial<MassUpdateState> | null;
          setState({ ...DEFAULT_STATE, ...(nextData || {}) });
        });
      } catch (error: any) {
        logger.error('[mass-worker-update] failed to subscribe to Sync document', error);
      }
    })();

    const interval = setInterval(() => setTick((n) => n + 1), 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      try {
        doc?.close();
      } catch (error: any) {
        logger.error('[mass-worker-update] error closing Sync document', error);
      }
    };
  }, []);

  const cancel = useCallback(async () => {
    if (!docRef) return;
    try {
      const current = (docRef.data as Partial<MassUpdateState>) || {};
      await docRef.update({ ...current, cancelled: true });
    } catch (error: any) {
      logger.error('[mass-worker-update] cancel write failed', error);
    }
  }, [docRef]);

  const heartbeatAt = state.heartbeatAt ?? 0;
  // The `tick` state is intentionally read here so React re-evaluates staleness
  // on each interval fire, even if no Sync update has arrived.
  const isStale = tick >= 0 && state.inProgress && heartbeatAt > 0 && Date.now() - heartbeatAt > getStaleHeartbeatMs();

  return { state, isStale, cancel };
};
