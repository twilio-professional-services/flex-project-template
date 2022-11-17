const { isString, isObject, isNumber } = require("lodash");

const retryHandler = require(Runtime.getFunctions()[
  "common/twilio-wrappers/retry-handler"
].path).retryHandler;

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.interactionSid the Interaction Sid for this channel
 * @param {string} parameters.channelSid the sid of the channel
 * @param {object} parameters.routing the interactions routing logic
 * @returns {object} An object containing details about the interaction channel invite
 * @description the following method is used to create an Interaction Channel Invite
 */
exports.participantCreateInvite = async function (parameters) {
  const { attempts, context, interactionSid, channelSid, routing } =
    parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isObject(context))
    throw "Invalid parameters object passed. Parameters must contain context object";
  if (!isString(interactionSid))
    throw "Invalid parameters object passed. Parameters must contain interactionSid string value";
  if (!isString(channelSid))
    throw "Invalid parameters object passed. Parameters must contain channelSid string value";
  if (!isObject(routing))
    throw "Invalid parameters object passed. Parameters must contain routing object";

  try {
    const client = context.getTwilioClient();

    const participantInvite = await client.flexApi.v1
      .interaction(interactionSid)
      .channels(channelSid)
      .invites.create({
        routing: routing,
      });

    return { success: true, status: 200, participantInvite };
  } catch (error) {
    return retryHandler(error, parameters, arguments.callee);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.interactionSid the Interaction Sid for this channel
 * @param {string} parameters.channelSid The Channel Sid for this Participant
 * @param {string} parameters.participantSid the unique string created by Twilio to identify an Interaction Channel resource
 * @param {string} parameters.status the Participant's status - can be: closed or wrapup. Participant must be an agent.
 * @returns {object} An object containing an array of queues for the account
 * @description the following method is used to update/modify a channel participant
 */
exports.participantUpdate = async function (parameters) {
  const {
    attempts,
    context,
    interactionSid,
    channelSid,
    participantSid,
    status,
  } = parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isObject(context))
    throw "Invalid parameters object passed. Parameters must contain context object";
  if (!isString(interactionSid))
    throw "Invalid parameters object passed. Parameters must contain interactionSid string value";
  if (!isString(channelSid))
    throw "Invalid parameters object passed. Parameters must contain channelSid string value";
  if (!isString(participantSid))
    throw "Invalid parameters object passed. Parameters must contain participantSid string value";
  if (!isString(status))
    throw "Invalid parameters object passed. Parameters must contain status string value";

  try {
    const client = context.getTwilioClient();
    const updatedParticipant = await client.flexApi.v1
      .interaction(interactionSid)
      .channels(channelSid)
      .participants(participantSid)
      .update({ status: status });

    return { success: true, status: 200, updatedParticipant };
  } catch (error) {
    return retryHandler(error, parameters, arguments.callee);
  }
};
