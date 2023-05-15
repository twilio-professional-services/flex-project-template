const { isString, isObject, isNumber } = require('lodash');

const retryHandler = require(Runtime.getFunctions()['common/helpers/retry-handler'].path).retryHandler;

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conversationSid the conversation to be fetched
 * @returns {object} An object containing the conversation
 * @description the following method is used to get a conversation
 */
exports.getConversation = async function getConversation(parameters) {
  const { context, conversationSid } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(conversationSid))
    throw new Error('Invalid parameters object passed. Parameters must contain conversationSid string');

  try {
    const client = context.getTwilioClient();

    const conversation = await client.conversations.v1.conversations(conversationSid).fetch();

    return { success: true, status: 200, conversation };
  } catch (error) {
    return retryHandler(error, parameters, exports.updateAttributes);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conversationSid the sid for this conversation
 * @param {number} parameters.limit max number of participants to list
 * @returns {object} An object containing an array of participants
 * @description the following method is used to list conversation participants
 */
exports.participantList = async function participantList(parameters) {
  const { context, conversationSid, limit } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(conversationSid))
    throw new Error('Invalid parameters object passed. Parameters must contain conversationSid string value');
  if (!isNumber(limit)) throw new Error('Invalid parameters object passed. Parameters must contain limit number value');

  try {
    const client = context.getTwilioClient();
    const participants = await client.conversations.v1.conversations(conversationSid).participants.list({ limit });

    return { success: true, status: 200, participants };
  } catch (error) {
    return retryHandler(error, parameters, exports.participantList);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conversationSid the conversation to be updated
 * @param {object} parameters.attributes the attributes to apply to the channel
 * @returns {object} An object containing the updated conversation
 * @description the following method is used to apply attributes
 *    to the conversation object
 */
exports.updateAttributes = async function updateAttributes(parameters) {
  const { context, conversationSid, attributes } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(conversationSid))
    throw new Error('Invalid parameters object passed. Parameters must contain conversationSid string');
  if (!isString(attributes))
    throw new Error('Invalid parameters object passed. Parameters must contain attributes string');

  try {
    const client = context.getTwilioClient();

    const conversation = await client.conversations.v1.conversations(conversationSid).update({ attributes });

    return { success: true, status: 200, conversation };
  } catch (error) {
    return retryHandler(error, parameters, exports.updateAttributes);
  }
};
