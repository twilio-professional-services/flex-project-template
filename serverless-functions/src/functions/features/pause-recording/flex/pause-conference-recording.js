const { prepareFlexFunction } = require(Runtime.getFunctions()["common/helpers/prepare-function"].path);
const VoiceOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/programmable-voice"
].path);

const requiredParameters = [
  { key: "conferenceSid", purpose: "unique ID of conference to pause recording" },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { conferenceSid, pauseBehavior, recordingSid } = event;
    
    const result = await VoiceOperations.updateConferenceRecording({
      context,
      conferenceSid,
      recordingSid: recordingSid ?? 'Twilio.CURRENT',
      params: {
        status: 'paused',
        pauseBehavior: pauseBehavior ?? 'silence'
      },
      attempts: 0,
    });
    
    const { success, recording, status } = result;
    
    response.setStatusCode(status);
    response.setBody({ success, recording });
    callback(null, response);
  } catch (error) {
    handleError(error);
  }
});