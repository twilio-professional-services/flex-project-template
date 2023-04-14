const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
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
      attempts: 0,
    });

    const { success, recording, status, message, twilioErrorCode, twilioDocPage } = result;

    response.setStatusCode(status);
    response.setBody({ success, recording, message, twilioErrorCode, twilioDocPage });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
