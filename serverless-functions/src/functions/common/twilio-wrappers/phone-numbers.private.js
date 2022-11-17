const { isObject } = require("lodash");
const retryHandler = require(Runtime.getFunctions()[
  "common/twilio-wrappers/retry-handler"
].path).retryHandler;

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @returns {Array<PhoneNumber>} An array of phone numbers for the account
 * @description the following method is used to robustly retrieve
 *   the phone numbers for the account
 */
exports.listPhoneNumbers = async function listPhoneNumbers(parameters) {
  if (!isObject(parameters.context))
    throw "Invalid parameters object passed. Parameters must contain context object";

  try {
    const client = parameters.context.getTwilioClient();
    const phoneNumbers = await client.incomingPhoneNumbers.list({
      limit: 1000,
    });

    return { success: true, phoneNumbers, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, arguments.callee);
  }
};
