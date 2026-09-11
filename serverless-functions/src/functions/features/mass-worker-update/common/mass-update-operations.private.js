const TaskRouterOperations = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);
const SyncDoc = require(Runtime.getFunctions()['features/mass-worker-update/common/sync-doc-helpers'].path);

/**
 * Computes the next `routing.skills` array AND the next `routing.levels` object
 * for a worker given the requested add/remove sets. Existing skills not
 * mentioned in either set stay untouched; levels for skills being removed are
 * dropped alongside them. Levels supplied on `add` entries overwrite any prior
 * level for that skill (TaskRouter skills configured with `min`/`max` support
 * a numeric ranking stored under `routing.levels[skillName]`).
 *
 * @param {{skills?: string[], levels?: Object<string, number>}} currentRouting
 * @param {Array<{name: string, level?: number}>} add
 * @param {string[]} remove
 * @returns {{skills: string[], levels: Object<string, number>}}
 */
exports.mergeSkills = (currentRouting = {}, add = [], remove = []) => {
  const removeSet = new Set(remove);
  const currentSkills = Array.isArray(currentRouting.skills) ? currentRouting.skills : [];
  const currentLevels = currentRouting.levels && typeof currentRouting.levels === 'object' ? currentRouting.levels : {};

  const nextSkillsSet = new Set(currentSkills.filter((s) => !removeSet.has(s)));
  const nextLevels = {};
  for (const [name, level] of Object.entries(currentLevels)) {
    if (!removeSet.has(name)) nextLevels[name] = level;
  }

  for (const entry of add || []) {
    if (!entry || typeof entry.name !== 'string') continue;
    nextSkillsSet.add(entry.name);
    if (typeof entry.level === 'number' && Number.isFinite(entry.level)) {
      nextLevels[entry.name] = entry.level;
    }
  }

  return {
    skills: Array.from(nextSkillsSet),
    levels: nextLevels,
  };
};

/**
 * Chunks `arr` into groups of at most `size`. Preserves order.
 */
const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

/**
 * Applies the requested skill mutations to a single worker via TaskRouter.
 * Returns { ok: true, sid } on success or throws with the worker sid attached
 * so the caller (Promise.allSettled) can attribute the failure. Kept private
 * — callers should invoke `runMassUpdate` which drives batches.
 */
const applyOneWorkerUpdate = async ({ context, worker, addSkills, removeSkills }) => {
  const currentRouting = (worker.attributes && worker.attributes.routing) || {};
  const { skills: nextSkills, levels: nextLevels } = exports.mergeSkills(currentRouting, addSkills, removeSkills);
  const nextAttributes = {
    ...worker.attributes,
    routing: {
      ...currentRouting,
      skills: nextSkills,
      levels: nextLevels,
    },
  };
  const updateResult = await TaskRouterOperations.updateWorker({
    context,
    workerSid: worker.sid,
    attributes: JSON.stringify(nextAttributes),
  });
  if (!updateResult.success) {
    const err = new Error(`Failed to update worker ${worker.sid} (status ${updateResult.status})`);
    err.workerSid = worker.sid;
    err.status = updateResult.status;
    throw err;
  }
  return { ok: true, sid: worker.sid };
};

/**
 * Runs the mass-worker-update loop. Workers are updated in concurrent batches
 * of `batchSize` via `Promise.allSettled`. This function is intentionally
 * structured so it can be lifted onto external compute (Cloud Run / Lambda)
 * unchanged — all coordination state lives in the shared Sync Document,
 * nothing survives in local memory between batches.
 *
 * Cancel semantics: the Sync doc is re-read BEFORE each batch dispatch. When
 * `cancelled` is true, no further batches are dispatched, but any batch
 * already in flight is allowed to finish (its results are counted into
 * `processed`) before the loop exits. Workers already updated are not rolled
 * back. Cancel latency is therefore "next batch," not "next worker" — a
 * bounded regression when batchSize > 1.
 *
 * Failure policy: `Promise.allSettled` observes every result within a batch.
 * If ANY promise rejects, the loop finishes that batch, writes the failure
 * into the Sync doc, and aborts (matches the pre-batching abort-on-failure
 * behavior at batch granularity).
 *
 * @param {object} params
 * @param {object} params.context Twilio Function context
 * @param {string} params.uniqueName the Sync Document unique name
 * @param {Array<{sid,friendlyName,attributes}>} params.workers workers to update
 * @param {Array<{name: string, level?: number}>} params.addSkills skills to
 *   add (union). Optional `level` populates `routing.levels[name]` for skills
 *   configured with min/max in the hosted `taskrouter_skills`.
 * @param {string[]} params.removeSkills skills to remove (removes level too)
 * @param {string} params.startedBy worker SID that initiated the run
 * @param {string|null} [params.startedByName] friendly `full_name` of the
 *   initiating worker, if it was successfully looked up.
 * @param {number} [params.batchSize=1] concurrency per batch. 1 restores the
 *   fully sequential behavior. Assumed pre-clamped by the caller.
 * @returns {object} { cancelled, processed, total, error }
 */
exports.runMassUpdate = async ({
  context,
  uniqueName,
  workers,
  addSkills,
  removeSkills,
  startedBy,
  startedByName = null,
  batchSize = 1,
}) => {
  const total = workers.length;
  const startedAt = Date.now();
  const effectiveBatchSize = Math.max(1, Math.floor(batchSize));

  await SyncDoc.writeState(context, uniqueName, {
    inProgress: true,
    startedBy,
    startedByName,
    startedAt,
    total,
    processed: 0,
    cancelled: false,
    heartbeatAt: startedAt,
    error: null,
  });

  let processed = 0;
  const batches = chunk(workers, effectiveBatchSize);

  for (const batch of batches) {
    // Cancel check happens BEFORE dispatching the batch. A cancel arriving
    // while a batch is in flight is picked up on the next iteration — all
    // workers in the in-flight batch will complete their updates first.
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

    const results = await Promise.allSettled(
      batch.map((worker) => applyOneWorkerUpdate({ context, worker, addSkills, removeSkills })),
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failures = results.filter((r) => r.status === 'rejected');
    processed += succeeded;

    if (failures.length > 0) {
      const firstError = failures[0].reason;
      // Log every failure in the batch so operators can see the full picture
      // in the Twilio Function logs even though only the first is surfaced
      // in the Sync doc.
      for (const failure of failures) {
        console.error(`mass-worker-update: batch failure — ${failure.reason?.message ?? failure.reason}`);
      }
      await SyncDoc.writeState(context, uniqueName, {
        ...current,
        inProgress: false,
        processed,
        heartbeatAt: Date.now(),
        error: firstError?.message ?? `Failed to update ${failures.length} worker(s) in batch`,
      });
      return {
        cancelled: false,
        processed,
        total,
        error: firstError?.message ?? 'Batch update failure',
      };
    }

    // One progress/heartbeat write per batch — if the Function times out
    // during a batch, the frontend detects the stale heartbeat and surfaces
    // the Reset affordance.
    await SyncDoc.writeState(context, uniqueName, {
      ...current,
      processed,
      heartbeatAt: Date.now(),
    });
  }

  await SyncDoc.writeState(context, uniqueName, {
    inProgress: false,
    startedBy,
    startedByName,
    startedAt,
    total,
    processed,
    cancelled: false,
    heartbeatAt: Date.now(),
    error: null,
  });

  return { cancelled: false, processed, total, error: null };
};
