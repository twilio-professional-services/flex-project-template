const { isString, isObject } = require('lodash');
const axios = require('axios');

const retryHandler = require(Runtime.getFunctions()['common/helpers/retry-handler'].path).retryHandler;

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.callSid the unique call SID to fetch
 * @returns {Map} The given call's properties
 * @description fetches the given call SID's properties
 */
exports.fetchProperties = async function fetchProperties(parameters) {
  const { context, callSid } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(callSid)) throw new Error('Invalid parameters object passed. Parameters must contain callSid string');

  try {
    const client = context.getTwilioClient();

    const callProperties = await client.calls(callSid).fetch();

    return { success: true, callProperties, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.fetchProperties);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.callSid the unique call SID to fetch
 * @param {string} parameters.to the phone number to transfer to
 * @param {string} parameters.from optional, the phone number to use as caller id
 * @returns {object} generic response object
 * @description cold transfers the given call SID to the given phone number
 */
exports.coldTransfer = async function coldTransfer(parameters) {
  const { context, callSid, to, from } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(callSid)) throw new Error('Invalid parameters object passed. Parameters must contain callSid string');
  if (!isString(to)) throw new Error('Invalid parameters object passed. Parameters must contain to string');

  try {
    const client = context.getTwilioClient();
    let callerIdStr = '';

    if (from) {
      callerIdStr = ` callerId="${from}"`;
    }

    if (to.startsWith('sip')) {
      await client.calls(callSid).update({
        twiml: `<Response><Dial${callerIdStr}><Sip>${to}</Sip></Dial></Response>`,
      });
    } else {
      await client.calls(callSid).update({
        twiml: `<Response><Dial${callerIdStr}>${to}</Dial></Response>`,
      });
    }

    return { success: true, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.coldTransfer);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.callSid the unique call SID to fetch
 * @param {object} parameters.params recording creation parameters
 * @returns {Map} The new recording's properties
 * @description creates recording for the given call SID
 */
exports.createRecording = async function createRecording(parameters) {
  const { context, callSid, params } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(callSid)) throw new Error('Invalid parameters object passed. Parameters must contain callSid string');

  try {
    const client = context.getTwilioClient();

    const recording = await client.calls(callSid).recordings.create(params);

    return { success: true, recording, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.createRecording);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.callSid the unique call SID to update recording
 * @param {string} parameters.recordingSid the unique recording SID to update
 * @param {object} parameters.params recording update parameters
 * @returns {Map} The recording's properties
 * @description updates the given recording for the given call
 */
exports.updateCallRecording = async function updateCallRecording(parameters) {
  const { context, callSid, recordingSid, params } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(callSid)) throw new Error('Invalid parameters object passed. Parameters must contain callSid string');
  if (!isString(recordingSid))
    throw new Error('Invalid parameters object passed. Parameters must contain recordingSid string');
  if (!isObject(params)) throw new Error('Invalid parameters object passed. Parameters must contain params object');

  try {
    const client = context.getTwilioClient();

    const recording = await client.calls(callSid).recordings(recordingSid).update(params);

    return { success: true, recording, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.updateCallRecording);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conferenceSid the unique conference SID to update recording
 * @param {string} parameters.recordingSid the unique recording SID to update
 * @param {object} parameters.params recording update parameters
 * @returns {Map} The recording's properties
 * @description updates the given recording for the given call
 */
exports.updateConferenceRecording = async function updateConferenceRecording(parameters) {
  const { context, conferenceSid, recordingSid, params } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(conferenceSid))
    throw new Error('Invalid parameters object passed. Parameters must contain conferenceSid string');
  if (!isString(recordingSid))
    throw new Error('Invalid parameters object passed. Parameters must contain recordingSid string');
  if (!isObject(params)) throw new Error('Invalid parameters object passed. Parameters must contain params object');

  try {
    const client = context.getTwilioClient();

    const recording = await client.conferences(conferenceSid).recordings(recordingSid).update(params);

    return { success: true, recording, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.updateConferenceRecording);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.callSid the unique call SID to update
 * @param {object} parameters.params call update parameters
 * @returns {Map} The call's properties
 * @description updates the given call
 */
exports.updateCall = async function updateCall(parameters) {
  const { context, callSid, params } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(callSid)) throw new Error('Invalid parameters object passed. Parameters must contain callSid string');
  if (!isObject(params)) throw new Error('Invalid parameters object passed. Parameters must contain params object');

  try {
    const client = context.getTwilioClient();

    const call = await client.calls(callSid).update(params);

    return { success: true, call, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.updateCall);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.queueSid the unique queue SID to fetch
 * @returns {Map} The given queue's properties
 * @description fetches the given queue SID's properties
 */
exports.fetchVoiceQueue = async (parameters) => {
  const { context, queueSid } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(queueSid)) throw new Error('Invalid parameters object passed. Parameters must contain queueSid string');

  try {
    const client = context.getTwilioClient();

    const queueProperties = await client.queues(queueSid).fetch();

    return { success: true, queueProperties, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.fetchVoiceQueue);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.recordingSid the unique recording SID to fetch
 * @returns {Map} The given recording's properties
 * @description fetches the given recording SID's properties
 */
exports.fetchRecording = async (parameters) => {
  const { context, recordingSid } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(recordingSid))
    throw new Error('Invalid parameters object passed. Parameters must contain recordingSid string');

  try {
    const client = context.getTwilioClient();

    const recordingProperties = await client.recordings(recordingSid).fetch();

    return { success: true, recordingProperties, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.fetchRecording);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.recordingSid the recording sid to fetch
 * @returns {object} the recording audio file encoded as base64
 * @description fetches recording by sid
 */
exports.fetchRecordingMedia = async (parameters) => {
  const { recordingSid } = parameters;

  if (!isString(recordingSid))
    throw new Error('Invalid parameters object passed. Parameters must contain recordingSid string');

  try {
    const config = {
      auth: {
        username: process.env.ACCOUNT_SID,
        password: process.env.AUTH_TOKEN,
      },
      responseType: 'arraybuffer',
    };

    const getResponse = await axios.get(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.ACCOUNT_SID}/Recordings/${recordingSid}.mp3`,
      config,
    );

    return {
      success: true,
      status: 200,
      recording: getResponse?.data.toString('base64' ?? ''),
      type: getResponse?.headers['content-type'],
    };
  } catch (error) {
    return retryHandler(error, parameters, exports.fetchRecordingMedia);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @returns {Array<PhoneNumber>} An array of outbound caller ids for the account
 * @description the following method is used to robustly retrieve
 *   the outbound caller ids for the account
 */
exports.listOutgoingCallerIds = async function listOutgoingCallerIds(parameters) {
  if (!isObject(parameters.context))
    throw new Error('Invalid parameters object passed. Parameters must contain context object');

  try {
    const client = parameters.context.getTwilioClient();
    const callerIds = await client.outgoingCallerIds.list({
      limit: 1000,
    });

    return { success: true, callerIds, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.listOutgoingCallerIds);
  }
};
