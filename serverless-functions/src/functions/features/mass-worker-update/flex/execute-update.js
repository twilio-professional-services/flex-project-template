const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const TaskRouterOperations = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);
const { buildTargetExpression } = require(Runtime.getFunctions()[
  'features/mass-worker-update/common/build-target-expression'
].path);
const SyncDoc = require(Runtime.getFunctions()['features/mass-worker-update/common/sync-doc-helpers'].path);
const { runMassUpdate } = require(Runtime.getFunctions()['features/mass-worker-update/common/mass-update-operations']
  .path);

const requiredParameters = [{ key: 'uniqueName', purpose: 'the Sync Document uniqueName that holds shared run state' }];

const DEFAULT_BATCH_SIZE = 5;
const MIN_BATCH_SIZE = 1;
const MAX_BATCH_SIZE = 25;

/**
 * Clamps the client-supplied batch size into the sane range. The plugin
 * also clamps client-side, so this is defense in depth against direct API
 * callers or malformed payloads.
 */
const clampBatchSize = (raw) => {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return DEFAULT_BATCH_SIZE;
  const rounded = Math.floor(parsed);
  return Math.min(MAX_BATCH_SIZE, Math.max(MIN_BATCH_SIZE, rounded));
};

const asArray = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Normalizes the addSkills payload. Accepts either `[{name, level?}]` (the
 * shape produced by the plugin's SkillMutationPicker) or plain `[string]` for
 * backwards compatibility. Entries without a valid name are dropped.
 */
const parseAddSkills = (raw) => {
  return asArray(raw)
    .map((entry) => {
      if (typeof entry === 'string') return { name: entry };
      if (entry && typeof entry.name === 'string') {
        const out = { name: entry.name };
        if (typeof entry.level === 'number' && Number.isFinite(entry.level)) {
          out.level = entry.level;
        }
        return out;
      }
      return null;
    })
    .filter(Boolean);
};

const parseRemoveSkills = (raw) => {
  return asArray(raw)
    .map((entry) => {
      if (typeof entry === 'string') return entry;
      if (entry && typeof entry.name === 'string') return entry.name;
      return null;
    })
    .filter((name) => typeof name === 'string' && name.length > 0);
};

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    if (!event.TokenResult.roles.includes('admin')) {
      response.setStatusCode(403);
      response.setBody({ success: false, error: 'User does not have the permissions to perform this action.' });
      return callback(null, response);
    }

    const { uniqueName, team, department, skill } = event;
    const addSkills = parseAddSkills(event.addSkills);
    const removeSkills = parseRemoveSkills(event.removeSkills);

    if (addSkills.length === 0 && removeSkills.length === 0) {
      response.setStatusCode(400);
      response.setBody({ success: false, error: 'Provide at least one skill to add or remove.' });
      return callback(null, response);
    }

    // Reject a second concurrent run — another admin's operation is in flight.
    const existing = await SyncDoc.fetchState(context, uniqueName);
    if (existing && existing.inProgress) {
      response.setStatusCode(409);
      response.setBody({
        success: false,
        error: 'A mass worker update is already in progress.',
        state: existing,
      });
      return callback(null, response);
    }

    let targetWorkersExpression;
    try {
      targetWorkersExpression = buildTargetExpression({ team, department, skill });
    } catch (err) {
      response.setStatusCode(400);
      response.setBody({ success: false, error: err.message });
      return callback(null, response);
    }

    const listResult = await TaskRouterOperations.listWorkers({
      context,
      targetWorkersExpression,
    });

    if (!listResult.success) {
      response.setStatusCode(listResult.status || 500);
      response.setBody({
        success: false,
        error: 'Failed to list workers',
        ...extractStandardResponse(listResult),
      });
      return callback(null, response);
    }

    const workers = listResult.data || [];

    if (workers.length === 0) {
      response.setStatusCode(200);
      response.setBody({ success: true, processed: 0, total: 0, cancelled: false });
      return callback(null, response);
    }

    // Ensure the doc exists before the runner writes to it.
    await SyncDoc.getOrCreate(context, uniqueName);

    const startedBy = event.TokenResult.worker_sid || event.TokenResult.identity || 'unknown';

    // Best-effort lookup of the initiating admin's `attributes.full_name` so
    // the progress modal can show a readable name instead of the raw SID.
    // Non-fatal on failure — the modal will fall back to the SID with a note.
    let startedByName = null;
    if (event.TokenResult.worker_sid) {
      try {
        const fetched = await TaskRouterOperations.fetchWorker({
          context,
          workerSid: event.TokenResult.worker_sid,
        });
        if (fetched.success) {
          const attrs = fetched.data?.attributes;
          if (attrs && typeof attrs.full_name === 'string' && attrs.full_name.length > 0) {
            startedByName = attrs.full_name;
          }
        }
      } catch (nameError) {
        console.warn(`mass-worker-update: could not resolve initiator name — ${nameError.message}`);
      }
    }

    const result = await runMassUpdate({
      context,
      uniqueName,
      workers,
      addSkills,
      removeSkills,
      startedBy,
      startedByName,
      batchSize: clampBatchSize(event.batchSize),
    });

    response.setStatusCode(200);
    response.setBody({ success: !result.error, ...result });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
