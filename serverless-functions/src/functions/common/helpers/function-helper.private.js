const crypto = require('crypto');

const axios = require('axios');
const { isObject, isString } = require('lodash');
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
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
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
 * @returns {object}
 * @description convenience method for handing over work to another function
 */
exports.handOffProcessing = async (context, event, function_path, payload) => {
  let document;
  const domain = event.request.headers.host || context.DOMAIN_NAME;
  const url = `https://${domain}/${function_path}`;

  let handoffSid;

  if (event.handoffSid) {
    handoffSid = event.handoffSid;
    document = await updateDocumentData({
      context,
      documentSid: handoffSid,
      updateData: {
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
          console.log('error', error);
        }
        if ((document && document.document.data.complete) || tries > 10) {
          if (process.env.LOG_EVENTS === 'true')
            console.log(`handoff complete for ${documentSid} after ${tries} tries`);
          clearInterval(interval);
          resolve(true);
        }
      }, 800);
    });

  await documentUpdated(context, document.document.sid);
  return document.document;
};

receiveHandOff = async (context, event) => {
  const { handoffSid } = event;

  try {
    await updateDocumentData({
      context,
      documentSid: handoffSid,
      updateData: {
        complete: true,
        total: event.total,
        remaining: event.remaining,
        last_updated: new Date(),
      },
    });
  } catch (error) {
    console.log('Error updating doc for handoff', error);
  }
};

exports.prepareHandoffFunction = (requiredParameters, handlerFn) => {
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
