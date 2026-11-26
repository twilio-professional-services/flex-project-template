const { isObject, isString } = require('lodash');

const { twilioExecute } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);

/**
 * @param {object} parameters the parameters for the function
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.uniqueName unique name of the Sync Document
 * @returns {object} { success, status, data: { data, revision, ... } }
 * @description fetches a Sync Document by unique name. Returns success: false
 *   with status 404 if the document does not exist.
 */
exports.fetchDocument = async function fetchDocument(parameters) {
  const { context, uniqueName } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(uniqueName))
    throw new Error('Invalid parameters object passed. Parameters must contain uniqueName string');

  return twilioExecute(context, (client) =>
    client.sync.services(process.env.TWILIO_FLEX_SYNC_SID).documents(uniqueName).fetch(),
  );
};

/**
 * @param {object} parameters the parameters for the function
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.uniqueName unique name of the Sync Document
 * @param {object} parameters.data the JSON data payload to store on the document
 * @param {number} [parameters.ttl] optional TTL in seconds
 * @returns {object} { success, status, data }
 * @description creates a new Sync Document with the given unique name.
 */
exports.createDocument = async function createDocument(parameters) {
  const { context, uniqueName, data, ttl } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(uniqueName))
    throw new Error('Invalid parameters object passed. Parameters must contain uniqueName string');
  if (!isObject(data)) throw new Error('Invalid parameters object passed. Parameters must contain data object');

  const params = { uniqueName, data };
  if (ttl) params.ttl = ttl;

  return twilioExecute(context, (client) =>
    client.sync.services(process.env.TWILIO_FLEX_SYNC_SID).documents.create(params),
  );
};

/**
 * @param {object} parameters the parameters for the function
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.uniqueName unique name of the Sync Document
 * @param {object} parameters.data the JSON data payload to write (full replacement)
 * @returns {object} { success, status, data }
 * @description updates the data payload of an existing Sync Document. The write
 *   REPLACES the document data (Sync itself does not deep-merge). Callers that
 *   want to merge should read the current data first and pass the merged result.
 */
exports.updateDocument = async function updateDocument(parameters) {
  const { context, uniqueName, data } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(uniqueName))
    throw new Error('Invalid parameters object passed. Parameters must contain uniqueName string');
  if (!isObject(data)) throw new Error('Invalid parameters object passed. Parameters must contain data object');

  return twilioExecute(context, (client) =>
    client.sync.services(process.env.TWILIO_FLEX_SYNC_SID).documents(uniqueName).update({ data }),
  );
};

/**
 * @param {object} parameters the parameters for the function
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.uniqueName unique name of the Sync Document
 * @param {object} parameters.defaultData data to seed the document with if it
 *   does not yet exist
 * @returns {object} { success, status, data }
 * @description fetches a Sync Document, creating it with defaultData if the
 *   fetch returns a not-found error.
 */
exports.getOrCreateDocument = async function getOrCreateDocument(parameters) {
  const { context, uniqueName, defaultData } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(uniqueName))
    throw new Error('Invalid parameters object passed. Parameters must contain uniqueName string');
  if (!isObject(defaultData))
    throw new Error('Invalid parameters object passed. Parameters must contain defaultData object');

  const fetched = await exports.fetchDocument({ context, uniqueName });
  if (fetched.success) return fetched;
  // 404 → create; anything else → surface the failure
  if (fetched.status === 404) {
    return exports.createDocument({ context, uniqueName, data: defaultData });
  }
  return fetched;
};
