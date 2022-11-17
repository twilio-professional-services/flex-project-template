const { isString, isObject, isNumber } = require("lodash");

const retryHandler = require(Runtime.getFunctions()[
  "common/twilio-wrappers/retry-handler"
].path).retryHandler;

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.channelSid the channel to be updated
 * @param {object} parameters.attributes the attributes to apply to the channel
 * @returns {object} An object containing an array of queues for the account
 * @description the following method is used to apply attributes
 *    to the channel object
 */
exports.updateChannelAttributes = async function (parameters) {
  const { attempts, context, channelSid, attributes } = parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isObject(context))
    throw "Invalid parameters object passed. Parameters must contain context object";
  if (!isString(channelSid))
    throw "Invalid parameters object passed. Parameters must contain channelSid string";
  if (!isString(attributes))
    throw "Invalid parameters object passed. Parameters must contain attributes string";

  try {
    const client = context.getTwilioClient();
    const channel = await client.chat
      .services(context.TWILIO_FLEX_CHAT_SERVICE_SID)
      .channels(channelSid)
      .fetch();

    if (!channel) return { success: false, message: "channel not found" };

    const updatedChannel = await client.chat
      .services(context.TWILIO_FLEX_CHAT_SERVICE_SID)
      .channels(channelSid)
      .update({ attributes: attributes });

    return { success: true, status: 200, channel: updatedChannel };
  } catch (error) {
    return retryHandler(error, parameters, arguments.callee);
  }
};
