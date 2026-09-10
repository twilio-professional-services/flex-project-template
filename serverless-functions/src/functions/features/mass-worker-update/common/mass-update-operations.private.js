const TaskRouterOperations = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);
const SyncDoc = require(Runtime.getFunctions()['features/mass-worker-update/common/sync-doc-helpers'].path);

/**
 * Computes the next `routing.skills` array for a worker given the requested
 * add/remove sets. Existing skills not mentioned in either set stay untouched.
 * De-duplicates via a Set.
 * @param {string[]} current
 * @param {string[]} add
 * @param {string[]} remove
 * @returns {string[]}
 */
exports.mergeSkills = (current = [], add = [], remove = []) => {
  const removeSet = new Set(remove);
  const next = new Set((current || []).filter((s) => !removeSet.has(s)));
  (add || []).forEach((s) => next.add(s));
  return Array.from(next);
};

/**
 * Runs the mass-worker-update loop. This function is intentionally structured
 * so it can be lifted onto external compute (Cloud Run / Lambda) unchanged —
 * all coordination state lives in the shared Sync Document, nothing is held
 * in local memory between iterations.
 *
 * Cancel semantics: on each iteration we re-read the doc BEFORE the worker
 * update. If `cancelled` is true, we break, mark the doc as `inProgress: false`
 * with `error: 'cancelled'`, and return. Workers already updated are not
 * rolled back.
 *
 * @param {object} params
 * @param {object} params.context Twilio Function context
 * @param {string} params.uniqueName the Sync Document unique name
 * @param {Array<{sid,friendlyName,attributes}>} params.workers workers to update
 * @param {string[]} params.addSkills skills to add (union)
 * @param {string[]} params.removeSkills skills to remove
 * @param {string} params.startedBy worker SID that initiated the run
 * @returns {object} { cancelled, processed, total, error }
 */
exports.runMassUpdate = async ({ context, uniqueName, workers, addSkills, removeSkills, startedBy }) => {
  const total = workers.length;
  const startedAt = Date.now();

  await SyncDoc.writeState(context, uniqueName, {
    inProgress: true,
    startedBy,
    startedAt,
    total,
    processed: 0,
    cancelled: false,
    heartbeatAt: startedAt,
    error: null,
  });

  let processed = 0;

  for (const worker of workers) {
    // Re-read the doc before every update so a cancel from the UI is respected
    // on the next iteration. Any in-flight worker update completes before we
    // check again — this is documented as an intentional behavior.
    const current = await SyncDoc.fetchState(context, uniqueName);
    if (current?.cancelled) {
      await SyncDoc.writeState(context, uniqueName, {
        ...current,
        inProgress: false,
        processed,
        heartbeatAt: Date.now(),
        error: 'cancelled',
      });
      return { cancelled: true, processed, total, error: 'cancelled' };
    }

    const currentRouting = (worker.attributes && worker.attributes.routing) || {};
    const nextSkills = exports.mergeSkills(currentRouting.skills, addSkills, removeSkills);
    const nextAttributes = {
      ...worker.attributes,
      routing: {
        ...currentRouting,
        skills: nextSkills,
      },
    };

    const updateResult = await TaskRouterOperations.updateWorker({
      context,
      workerSid: worker.sid,
      attributes: JSON.stringify(nextAttributes),
    });

    if (!updateResult.success) {
      // Persist the failure into the shared doc so admins see it, then abort.
      // Workers processed before this point remain updated.
      await SyncDoc.writeState(context, uniqueName, {
        ...current,
        inProgress: false,
        processed,
        heartbeatAt: Date.now(),
        error: `Failed to update worker ${worker.sid} (status ${updateResult.status})`,
      });
      return {
        cancelled: false,
        processed,
        total,
        error: `Failed to update worker ${worker.sid}`,
      };
    }

    processed += 1;

    // Heartbeat + progress on every successful iteration. If the function times
    // out before writing this, the frontend detects the stale heartbeat and
    // surfaces a Reset affordance.
    await SyncDoc.writeState(context, uniqueName, {
      ...current,
      processed,
      heartbeatAt: Date.now(),
    });
  }

  await SyncDoc.writeState(context, uniqueName, {
    inProgress: false,
    startedBy,
    startedAt,
    total,
    processed,
    cancelled: false,
    heartbeatAt: Date.now(),
    error: null,
  });

  return { cancelled: false, processed, total, error: null };
};
