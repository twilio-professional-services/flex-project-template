const { isString, isObject } = require('lodash');

const { twilioExecute } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);

/**
 * @param {object} parameters the parameters for the function
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

  return twilioExecute(context, (client) => client.conversations.v1.conversations(conversationSid).fetch());
};

/**
 * @param {object} parameters the parameters for the function
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

  return twilioExecute(context, (client) =>
    client.conversations.v1.conversations(conversationSid).update({ attributes }),
  );
};
