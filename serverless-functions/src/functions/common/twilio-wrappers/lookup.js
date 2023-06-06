const { isObject, isString } = require('lodash');

const retryHandler = require(Runtime.getFunctions()['common/helpers/retry-handler'].path).retryHandler;

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.phoneNumber the phone number to validate
 * @returns {object} https://www.twilio.com/docs/lookup/v2-api#making-a-request
 * @description the following method is used to validate a phone number
 */
exports.validatePhoneNumber = async function validatePhoneNumber(parameters) {
  if (!isObject(parameters.context))
    throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(parameters.phoneNumber))
    throw new Error('Invalid parameters phone number passed. Parameters must contain phoneNumber string');

  try {
    const client = parameters.context.getTwilioClient();
    const lookupResponse = await client.lookups.v2.phoneNumbers(parameters.phoneNumber).fetch();

    return { success: true, lookupResponse, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.validatePhoneNumber);
  }
};
