const { isString, isObject, isNumber } = require('lodash');
const axios = require('axios');

const retryHandler = require(Runtime.getFunctions()['common/helpers/retry-handler'].path).retryHandler;

const INFLIGHT = 'inflight';
const COMPLETED = 'completed';

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.channelSid the channel to be updated
 * @param {object} parameters.taskSid the taskSid to add to the channel attributes
 * @returns {object} An object containing an array of queues for the account
 * @description the following method is used to add task tracking data to
 *  the chat channel attributes.  When called, the task sid is added to the
 *  channel data and marked as being "inflight".  Later setTaskToCompleteOnChannel
 *  is called which marks the task as "completed"
 */
exports.addTaskToChannel = async (parameters) => {
  const { context, channelSid, taskSid } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(channelSid))
    throw new Error('Invalid parameters object passed. Parameters must contain channelSid string');
  if (!isString(taskSid)) throw new Error('Invalid parameters object passed. Parameters must contain taskSid string');

  try {
    const client = context.getTwilioClient();
    const channel = await client.chat.services(context.TWILIO_FLEX_CHAT_SERVICE_SID).channels(channelSid).fetch();

    if (!channel) return { success: false, message: 'channel not found' };

    const currentAttributes = JSON.parse(channel.attributes);
    const associatedTasks = currentAttributes.associatedTasks || {};
    associatedTasks[taskSid] = INFLIGHT;
    const newAttributes = {
      ...currentAttributes,
      associatedTasks,
    };

    const updatedChannel = await client.chat
      .services(context.TWILIO_FLEX_CHAT_SERVICE_SID)
      .channels(channelSid)
      .update({ attributes: JSON.stringify(newAttributes) });

    return {
      success: true,
      status: 200,
      channel: updatedChannel,
    };
  } catch (error) {
    return retryHandler(error, parameters, exports.addTaskToChannel);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.channelSid the channel to be updated
 * @param {object} parameters.taskSid the taskSid to add to the channel attributes
 * @returns {object} An object containing an array of queues for the account
 * @description the following method is used to update/add task tracking data to
 *  the chat channel attributes.  When called, the task sid is updated/added on the
 *  channel data and marked as being "complete".
 */
exports.setTaskToCompleteOnChannel = async (parameters) => {
  const { context, channelSid, taskSid } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(channelSid))
    throw new Error('Invalid parameters object passed. Parameters must contain channelSid string');
  if (!isString(taskSid)) throw new Error('Invalid parameters object passed. Parameters must contain taskSid string');

  try {
    const client = context.getTwilioClient();
    const channel = await client.chat.services(context.TWILIO_FLEX_CHAT_SERVICE_SID).channels(channelSid).fetch();

    if (!channel) return { success: false, message: 'channel not found' };

    const currentAttributes = JSON.parse(channel.attributes);
    const associatedTasks = currentAttributes.associatedTasks || {};
    associatedTasks[taskSid] = COMPLETED;
    const newAttributes = {
      ...currentAttributes,
      associatedTasks,
    };

    const updatedChannel = await client.chat
      .services(context.TWILIO_FLEX_CHAT_SERVICE_SID)
      .channels(channelSid)
      .update({ attributes: JSON.stringify(newAttributes) });

    return {
      success: true,
      status: 200,
      channel: updatedChannel,
    };
  } catch (error) {
    return retryHandler(error, parameters, exports.setTaskToCompleteOnChannel);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {object} parameters.taskSid the taskSid to add to the channel attributes
 * @returns {object} An object containing an array of queues for the account
 * @description the following method is used to remove the chat channelSid
 *  from the task, this is required when transfering tasks as the channel
 *  janitor will clean up chat channels if a task is completed that has
 *  a channel sid.
 */
exports.removeChannelSidFromTask = async function removeChannelSidFromTask(parameters) {
  const { context, taskSid } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(taskSid)) throw new Error('Invalid parameters object passed. Parameters must contain taskSid string');

  try {
    const taskContextURL = `https://taskrouter.twilio.com/v1/Workspaces/${process.env.TWILIO_FLEX_WORKSPACE_SID}/Tasks/${taskSid}`;
    const config = {
      auth: {
        username: context.ACCOUNT_SID,
        password: context.AUTH_TOKEN,
      },
    };

    // we need to fetch the task using a rest API because
    // we need to examine the headers to get the ETag
    const getResponse = await axios.get(taskContextURL, config);
    let task = getResponse.data;
    task.attributes = JSON.parse(getResponse.data.attributes);
    task.revision = JSON.parse(getResponse.headers.etag);

    // merge the objects
    const updatedTaskAttributes = task.attributes;
    delete updatedTaskAttributes.channelSid;

    // if-match the revision number to ensure
    // no update collisions
    config.headers = {
      'If-Match': task.revision,
      'content-type': 'application/x-www-form-urlencoded',
    };

    data = new URLSearchParams({
      Attributes: JSON.stringify(updatedTaskAttributes),
    });

    task = (await axios.post(taskContextURL, data, config)).data;

    return {
      success: true,
      status: 200,
      task: {
        ...task,
        attributes: JSON.parse(task.attributes),
      },
    };
  } catch (error) {
    return retryHandler(error, parameters, exports.removeChannelSidFromTask);
  }
};
