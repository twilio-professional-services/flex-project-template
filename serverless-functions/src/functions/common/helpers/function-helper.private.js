const { isObject, isString } = require('lodash');
const TokenValidator = require('twilio-flex-token-validator').functionValidator;

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
 * @description convenience method to safely extract the standad elements in the response back to flex from serverless functions.  This can be used with any object that is returrned from any twilio-wrapper function.
 */
exports.extractStandardResponse = (object) => {
  const { success, message, twilioDocPage, twilioErrorCode } = object;
  return { success, message, twilioDocPage, twilioErrorCode };
};
