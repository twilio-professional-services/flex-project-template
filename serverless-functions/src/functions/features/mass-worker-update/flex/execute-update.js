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

const parseSkills = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    if (!event.TokenResult.roles.includes('admin')) {
      response.setStatusCode(403);
      response.setBody({ success: false, error: 'User does not have the permissions to perform this action.' });
      return callback(null, response);
    }

    const { uniqueName, team, department, skill } = event;
    const addSkills = parseSkills(event.addSkills);
    const removeSkills = parseSkills(event.removeSkills);

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

    const result = await runMassUpdate({
      context,
      uniqueName,
      workers,
      addSkills,
      removeSkills,
      startedBy,
    });

    response.setStatusCode(200);
    response.setBody({ success: !result.error, ...result });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
