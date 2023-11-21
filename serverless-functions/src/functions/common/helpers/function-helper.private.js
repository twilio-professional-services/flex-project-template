const crypto = require('crypto');

const axios = require('axios');
const { isObject, isString, isNumber, isArray } = require('lodash');
const TokenValidator = require('twilio-flex-token-validator').functionValidator;
const randomstring = require('randomstring');

const { createDocument, fetchDocument, updateDocumentData } = require(Runtime.getFunctions()[
  'common/twilio-wrappers/sync'
].path);

snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const prepareFunction = (context, event, callback, requiredParameters, handlerFn) => {
  const response = new Twilio.Response();
  const parameterError = module.exports.validateParameters(context.PATH, event, requiredParameters);

  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (parameterError) {
    console.error(`(${context.PATH}) invalid parameters passed`);
    response.setStatusCode(400);
    response.setBody({ data: null, message: parameterError });
    return callback(null, response);
  }

  const handleError = (error) => {
    console.error(`(${context.PATH}) Unexpected error occurred: ${error}`);
    response.setStatusCode(500);
    response.setBody({
      success: false,
      message: error,
    });
    return callback(null, response);
  };

  return handlerFn(context, event, callback, response, handleError);
};

// function for handling the protocol around an inbound handoff request
// primarily sets the 'complete' status to true so that the previous function
// can complete
const receiveHandOff = async (context, event) => {
  const { handoffSid, total, remaining } = event;

  try {
    if (process.env.LOG_HANDOVER_EVENTS === 'true')
      console.log(
        `BATCH PROCESSING: handoff received for ${handoffSid} with ${remaining} of ${total} tasks to be processed`,
      );
    await updateDocumentData({
      context,
      documentSid: handoffSid,
      updateData: {
        status: 'running',
        complete: true,
        total,
        remaining,
        last_updated: new Date(),
      },
    });
  } catch (error) {
    console.log('BATCH PROCESSING: Error updating doc for handoff', error);
  }
};

/**
 * @param {string} callingFunctionPath
 * @param {object} parameterObject
 * @param {Array} requiredKeysArray
 * @returns {string}
 * @description Convenience method to validate properties exist on an object
 * requiredKeysArray should be an array of strings or objects,
 *   { key: 'propertyName', purpose: 'describe need' }
 * error handling will fallback to less useful messages
 * if an array of strings is provided instead of the key and purpose objects
 */

exports.validateParameters = (callingFunctionPath, parameterObject, requiredKeysArray) => {
  let errorMessage = '';
  requiredKeysArray.forEach((data) => {
    if (isString(data)) {
      // Support "lazy" requiredKeysArray of just ['propertyName']
      if (parameterObject[data] === undefined || parameterObject[data] === null || parameterObject[data].length < 1) {
        errorMessage += `(${callingFunctionPath}) Missing ${data}`;
      }
    } else if (isObject(data) && data.key && data.purpose) {
      // Support "useful" requiredKeysArray of [{ key: 'propertyName', purpose: 'I need it' }]
      if (
        parameterObject[data.key] === undefined ||
        parameterObject[data.key] === null ||
        parameterObject[data.key].length < 1
      ) {
        errorMessage += `(${callingFunctionPath}) Missing ${data.key}: ${data.purpose}`;
      }
    } else {
      // No supported way for us to check parameter
      errorMessage += 'Invalid data provided to Parameter Validator function';
    }
  });
  return errorMessage;
};

/**
 * Prepares the function for execution. Validates the token and other required parameters, then prepares
 * the response object with the appropriate headers, as well as an error handling function.
 *
 * @param requiredParameters    array of parameters required and their description
 * @param handlerFn             the Twilio Runtime handler function to execute
 */
exports.prepareFlexFunction = (requiredParameters, handlerFn) => {
  return TokenValidator((context, event, callback) =>
    prepareFunction(context, event, callback, requiredParameters, handlerFn),
  );
};

/**
 * Prepares the function for execution. Validates required parameters, then prepares
 * the response object with the appropriate headers, as well as an error handling function.
 * Note: This is only intended for protected functions, and does not validate a token.
 *
 * @param requiredParameters    array of parameters required and their description
 * @param handlerFn             the Twilio Runtime handler function to execute
 */
exports.prepareStudioFunction = (requiredParameters, handlerFn) => {
  return (context, event, callback) => prepareFunction(context, event, callback, requiredParameters, handlerFn);
};

/**
 * @param {object} object
 * @returns {object}
 * @description convenience method to safely extract the standard elements in the response back to flex from serverless functions.  This can be used with any object that is returned from any twilio-wrapper function.
 */
exports.extractStandardResponse = (object) => {
  const { success, message, twilioDocPage, twilioErrorCode } = object;
  return { success, message, twilioDocPage, twilioErrorCode };
};

/**
 * @param context
 * @param url
 * @param payload
 * @returns {object}
 * @description convenience method for making a signed post request with application/json
 */
exports.signedHTTPPostWithJson = async (context, url, payload) => {
  // generate signatures
  const payloadString = JSON.stringify(payload || {});
  const hashBody256 = crypto.createHash('sha256', context.AUTH_TOKEN).update(payloadString).digest('hex');
  const signedUrl = `${url}?bodySHA256=${hashBody256}`;
  const hashBufferUrl = crypto.createHmac('sha1', context.AUTH_TOKEN).update(signedUrl).digest();
  const signature = hashBufferUrl.toString('base64');

  const config = {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'x-twilio-Signature': signature,
    },
  };

  try {
    await axios.post(signedUrl, payloadString, config);
  } catch (error) {
    console.log(`Error making request to ${signedUrl}
    ${error}`);
  }
};

/**
 * @param context         original context object
 * @param events          original event that triggered operation
 * @param function_path   path to function to handoff to
 * @param payload         data to be passed to function
 * @returns {object}      the sync doc containing progress details of the work
 * @description           method that manages a protocol for handing work to another function. Can be used to daisy chain functions together for processing larger volumes of data.
 */
exports.processBatch = async (context, event, function_path, payload) => {
  let document;
  let handoffSid;

  // this resolves domain name for local environment when using ngrok
  const domain = event.request.headers.host || context.DOMAIN_NAME;
  const url = `https://${domain}/${function_path}`;

  const { total, remaining, tasks } = payload;

  if (!isNumber(total))
    throw new Error(
      `Invalid payload object, payload must contain a number element 'total' that defines the total number of tasks to complete`,
    );
  if (!isNumber(remaining))
    throw new Error(
      `Invalid payload object, payload must contain a number element 'remaining' that defines the remaining number of tasks to complete`,
    );
  if (!isArray(tasks))
    throw new Error(
      `Invalid payload object, payload must contain an array element 'tasks' that contains the selection of tasks to be worked in batch`,
    );

  if (event.handoffSid) {
    handoffSid = event.handoffSid;

    // complete work
    if (tasks.length === 0) {
      console.log(`BATCH PROCESSING: processing complete for ${handoffSid} with ${total} tasks processed`);

      document = await updateDocumentData({
        context,
        documentSid: handoffSid,
        updateData: {
          status: 'completed',
          complete: true,
          total,
          remaining,
          last_updated: new Date(),
        },
      });
      return document.document;
    }

    // circuit breaker for stuck processing
    old_doc = await fetchDocument({ context, documentSid: handoffSid });
    previous_remaining = old_doc.document.data.remaining;
    if (previous_remaining === remaining) {
      console.warn(
        'BATCH PROCESSING: possible infinite loop detected, batch processed but nothing progressed. stopping batch processing',
      );
      document = await updateDocumentData({
        context,
        documentSid: handoffSid,
        updateData: {
          status: 'cancelled',
          complete: true,
          total: payload.total,
          remaining: payload.remaining,
          last_updated: new Date(),
        },
      });
      return document.document;
    }

    document = await updateDocumentData({
      context,
      documentSid: handoffSid,
      updateData: {
        status: 'running',
        complete: false,
        total: payload.total,
        remaining: payload.remaining,
        last_updated: new Date(),
      },
    });
  } else {
    const docName = `handoff-${randomstring.generate(20)}`;

    document = await createDocument({
      context,
      uniqueName: docName,
      ttl: '3600', // expires after an hour
      data: {
        status: 'running',
        complete: false,
        total: payload.total,
        remaining: payload.remaining,
        last_updated: new Date(),
      },
    });
  }

  payload = { ...payload, handoffSid: document.document.sid };

  exports.signedHTTPPostWithJson(context, url, payload);

  // eslint-disable-next-line no-shadow
  const documentUpdated = (context, documentSid) =>
    new Promise((resolve) => {
      let tries = 0;
      const interval = setInterval(async () => {
        // eslint-disable-next-line no-plusplus
        tries++;
        // eslint-disable-next-line no-shadow
        let document;
        try {
          document = await fetchDocument({ context, documentSid });
        } catch (error) {
          console.error('BATCH PROCESSING: error', error);
        }
        if ((document && document.document.data.complete) || tries > 10) {
          if (tries > 10) console.warn(`BATCH PROCESSING: handoff unconfirmed for ${documentSid} after ${tries} tries`);
          clearInterval(interval);
          resolve(true);
        }
      }, 1000);
    });

  await documentUpdated(context, document.document.sid);
  return document.document;
};

exports.prepareBatchProcessingFunction = (requiredParameters, handlerFn) => {
  return (context, event, callback) => {
    receiveHandOff(context, event);
    prepareFunction(context, event, callback, requiredParameters, handlerFn);
  };
};

exports.prepareStudioFunction = (requiredParameters, handlerFn) => {
  return (context, event, callback) => prepareFunction(context, event, callback, requiredParameters, handlerFn);
};

exports.prepareFlexFunction = (requiredParameters, handlerFn) => {
  return TokenValidator((context, event, callback) =>
    prepareFunction(context, event, callback, requiredParameters, handlerFn),
  );
};
