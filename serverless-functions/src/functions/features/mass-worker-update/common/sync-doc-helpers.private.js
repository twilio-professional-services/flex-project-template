const SyncOperations = require(Runtime.getFunctions()['common/twilio-wrappers/sync'].path);

/**
 * The initial state seeded into the Sync Document when it first needs to exist.
 * The document is a single source of truth for whether a mass-worker-update
 * operation is running, its progress, and whether it has been cancelled. Both
 * the serverless function and the plugin admins subscribe to this doc.
 */
exports.defaultState = () => ({
  inProgress: false,
  startedBy: null,
  startedAt: null,
  total: 0,
  processed: 0,
  cancelled: false,
  heartbeatAt: null,
  error: null,
});

/**
 * Fetches the mass-worker-update Sync Document, creating it if it doesn't exist.
 * @param {object} context Twilio Function context
 * @param {string} uniqueName the Sync Document uniqueName
 * @returns {object} { success, status, data: { data, ... } }
 */
exports.getOrCreate = async (context, uniqueName) => {
  return SyncOperations.getOrCreateDocument({
    context,
    uniqueName,
    defaultData: exports.defaultState(),
  });
};

/**
 * Fetches the current data payload from the mass-worker-update Sync Document.
 * @param {object} context
 * @param {string} uniqueName
 * @returns {object|null} the doc data, or null if it does not exist
 */
exports.fetchState = async (context, uniqueName) => {
  const result = await SyncOperations.fetchDocument({ context, uniqueName });
  if (!result.success) return null;
  return result.data?.data ?? null;
};

/**
 * Writes a full replacement of the state document.
 * @param {object} context
 * @param {string} uniqueName
 * @param {object} data
 */
exports.writeState = async (context, uniqueName, data) => {
  return SyncOperations.updateDocument({ context, uniqueName, data });
};
