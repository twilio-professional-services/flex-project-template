const { isString, isObject, isNumber } = require("lodash");

const retryHandler = require(Runtime.getFunctions()[
  "common/twilio-wrappers/retry-handler"
].path).retryHandler;

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.mapSid the SID of the Sync Map
 * @param {string} parameters.key the key of the Sync Map item
 * @returns {object} success
 * @description the following method is used to remove a Sync Map Item
 */
 exports.deleteMapItem = async function (parameters) {
  const { attempts, context, mapSid, key } = parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isObject(context))
    throw "Invalid parameters object passed. Parameters must contain context object";
  if (!!mapSid && !isString(mapSid))
    throw "Invalid parameters object passed. Parameters must contain mapSid string value";
  if (!!key && !isString(key))
    throw "Invalid parameters object passed. Parameters must contain key string value";

  try {
    const client = context.getTwilioClient();

    const mapItem = await client.sync
      .services(context.TWILIO_FLEX_SYNC_SID)
      .syncMaps(mapSid)
      .syncMapItems(key).remove();

    return { success: true, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, arguments.callee);
  }
};


/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.mapSid the SID of the Sync Map
 * @param {string} parameters.key the key of the Sync Map item
 * @returns {object} An existing Sync Map Item
 * @description the following method is used to fetch a Sync Map Item
 */
exports.fetchMapItem = async function (parameters) {
  const { attempts, context, mapSid, key } = parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isObject(context))
    throw "Invalid parameters object passed. Parameters must contain context object";
  if (!!mapSid && !isString(mapSid))
    throw "Invalid parameters object passed. Parameters must contain context object";
  if (!!key && !isString(key))
    throw "Invalid parameters object passed. Parameters must contain uniqueName string value";

  try {
    const client = context.getTwilioClient();

    const mapItem = await client.sync
      .services(context.TWILIO_FLEX_SYNC_SID)
      .syncMaps(mapSid)
      .syncMapItems(key).fetch();

    return { success: true, status: 200, mapItem: mapItem };
  } catch (error) {
    return retryHandler(error, parameters, arguments.callee);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.mapSid the SID of the Sync Map
 * @param {string} parameters.key the key of the Sync Map item
 * @param {number} parameters.ttl how long (in seconds) before the Sync item expires and is deleted (optional)
 * @param {object} parameters.data schema-less object that the Sync Map item stores - 16 KiB max (optional)
 * @returns {object} A new Sync Map Item
 * @description the following method is used to create a Sync Map Item
 */
exports.createMapItem = async function (parameters) {
  const { attempts, context, mapSid, key, ttl, data } = parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isObject(context))
    throw "Invalid parameters object passed. Parameters must contain context object";
  if (!!mapSid && !isString(mapSid))
    throw "Invalid parameters object passed. Parameters must contain context object";
  if (!!key && !isString(key))
    throw "Invalid parameters object passed. Parameters must contain uniqueName string value";
  if (!!ttl && !isString(ttl))
    throw "Invalid parameters object passed. Parameters must contain ttl integer value";
  if (!!data && !isObject(data))
    throw "Invalid parameters object passed. Parameters must contain data object";

  try {
    const client = context.getTwilioClient();
    const mapItemParameters = {
      key: key,
      ttl: ttl,
      data: data,
    };

    const mapItem = await client.sync
      .services(context.TWILIO_FLEX_SYNC_SID)
      .syncMaps(mapSid)
      .syncMapItems.create(mapItemParameters);

      return { success: true, status: 200, mapItem: mapItem };
  } catch (error) {
    return retryHandler(error, parameters, arguments.callee);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.uniqueName the unique name of the Sync document (optional)
 * @param {number} parameters.ttl how long (in seconds) before the Sync Document expires and is deleted (optional)
 * @param {object} parameters.data schema-less object that the Sync Document stores - 16 KiB max (optional)
 * @returns {object} A new Sync document
 * @description the following method is used to create a sync document
 */
exports.createDocument = async function (parameters) {
  const { attempts, context, uniqueName, ttl, data } = parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isObject(context))
    throw "Invalid parameters object passed. Parameters must contain context object";
  if (!!uniqueName && !isString(uniqueName))
    throw "Invalid parameters object passed. Parameters must contain uniqueName string value";
  if (!!ttl && !isString(ttl))
    throw "Invalid parameters object passed. Parameters must contain ttl integer value";
  if (!!data && !isObject(data))
    throw "Invalid parameters object passed. Parameters must contain data object";

  try {
    const client = context.getTwilioClient();
    const documentParameters = {
      uniqueName: uniqueName,
      ttl: ttl,
      data: data,
    };

    const document = await client.sync
      .services(context.TWILIO_FLEX_SYNC_SID)
      .documents.create(documentParameters);

    return { success: true, status: 200, document: document };
  } catch (error) {
    return retryHandler(error, parameters, arguments.callee);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.documentSid the sid of the Sync document
 * @returns {object} A Sync document
 * @description the following method is used to fetch a sync document
 */
exports.fetchDocument = async function (parameters) {
  const { attempts, context, documentSid } = parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isObject(context))
    throw "Invalid parameters object passed. Parameters must contain context object";
  if (!isString(documentSid))
    throw "Invalid parameters object passed. Parameters must contain documentSid string value";

  try {
    const client = context.getTwilioClient();

    const document = await client.sync
      .services(context.TWILIO_FLEX_SYNC_SID)
      .documents(documentSid)
      .fetch();

    return { success: true, status: 200, document: document };
  } catch (error) {
    return retryHandler(error, parameters, arguments.callee);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.documentSid the sid of the Sync document
 * @param {object} parameters.updateData the data object to update on the Sync document
 * @returns {object} A Sync document
 * @description the following method is used to fetch a sync document
 */
exports.updateDocumentData = async function (parameters) {
  const { attempts, context, documentSid, updateData } = parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isObject(context))
    throw "Invalid parameters object passed. Parameters must contain context object";
  if (!isString(documentSid))
    throw "Invalid parameters object passed. Parameters must contain documentSid string value";
  if (!isObject(updateData))
    throw "Invalid parameters object passed. Parameters must contain updateData object";

  try {
    const client = context.getTwilioClient();

    const documentUpdate = await client.sync
      .services(context.TWILIO_FLEX_SYNC_SID)
      .documents(documentSid)
      .update({ data: updateData });

    return { success: true, status: 200, document: documentUpdate };
  } catch (error) {
    return retryHandler(error, parameters, arguments.callee);
  }
};
