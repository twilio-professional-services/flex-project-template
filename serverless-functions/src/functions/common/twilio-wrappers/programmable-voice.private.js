const { isString, isObject } = require('lodash');
const axios = require('axios');

const { executeWithRetry, twilioExecute } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);

/**
 * @param {object} parameters the parameters for the function
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

  let callerIdStr = '';

  if (from) {
    callerIdStr = ` callerId="${from}"`;
  }

  return twilioExecute(context, (client) => {
    if (to.startsWith('sip')) {
      return client.calls(callSid).update({
        twiml: `<Response><Dial${callerIdStr}><Sip>${to}</Sip></Dial></Response>`,
      });
    }
    return client.calls(callSid).update({
      twiml: `<Response><Dial${callerIdStr}>${to}</Dial></Response>`,
    });
  });
};

/**
 * @param {object} parameters the parameters for the function
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.recordingSid the recording sid to fetch
 * @returns {object} the recording audio file encoded as base64
 * @description fetches recording by sid
 */
exports.fetchRecordingMedia = async (parameters) => {
  const { recordingSid } = parameters;

  if (!isString(recordingSid))
    throw new Error('Invalid parameters object passed. Parameters must contain recordingSid string');

  const config = {
    auth: {
      username: process.env.ACCOUNT_SID,
      password: process.env.AUTH_TOKEN,
    },
    responseType: 'arraybuffer',
  };

  return executeWithRetry(parameters.context, async () => {
    const getResponse = await axios.get(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.ACCOUNT_SID}/Recordings/${recordingSid}.mp3`,
      config,
    );

    return {
      recording: getResponse?.data.toString('base64' ?? ''),
      type: getResponse?.headers['content-type'],
    };
  });
};
