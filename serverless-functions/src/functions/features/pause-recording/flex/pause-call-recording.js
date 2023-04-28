const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const VoiceOperations = require(Runtime.getFunctions()['common/twilio-wrappers/programmable-voice'].path);

const requiredParameters = [{ key: 'callSid', purpose: 'unique ID of call to pause recording' }];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { callSid, pauseBehavior, recordingSid } = event;

    const result = await VoiceOperations.updateCallRecording({
      context,
      callSid,
      recordingSid: recordingSid ?? 'Twilio.CURRENT',
      params: {
        status: 'paused',
        pauseBehavior: pauseBehavior ?? 'silence',
      },
    });

    const { recording, status } = result;

    response.setStatusCode(status);
    response.setBody({ recording, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
