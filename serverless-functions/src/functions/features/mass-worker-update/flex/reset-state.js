const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const SyncDoc = require(Runtime.getFunctions()['features/mass-worker-update/common/sync-doc-helpers'].path);

const requiredParameters = [{ key: 'uniqueName', purpose: 'the Sync Document uniqueName to force-reset' }];

/**
 * Force-resets the mass-worker-update Sync Document to a not-in-progress state.
 * Intended for use when the compute runtime has timed out mid-loop and left
 * the document stuck with `inProgress: true`. Admin-only.
 */
exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    if (!event.TokenResult.roles.includes('admin')) {
      response.setStatusCode(403);
      response.setBody({ success: false, error: 'User does not have the permissions to perform this action.' });
      return callback(null, response);
    }

    const { uniqueName } = event;
    const current = (await SyncDoc.fetchState(context, uniqueName)) || SyncDoc.defaultState();

    const reset = {
      ...current,
      inProgress: false,
      cancelled: false,
      heartbeatAt: Date.now(),
      error: 'reset',
    };

    const result = await SyncDoc.writeState(context, uniqueName, reset);

    response.setStatusCode(result.success ? 200 : result.status || 500);
    response.setBody({ success: result.success, state: reset });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
