const { prepareFlexFunction } = require(Runtime.getFunctions()["common/helpers/prepare-function"].path);
const VoiceOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/programmable-voice"
].path);

const requiredParameters = [
  { key: "callSid", purpose: "unique ID of call to fetch" },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { callSid } = event;
    
    const result = await VoiceOperations.fetchProperties({
      context,
      callSid,
      attempts: 0,
    });
    
    const { success, callProperties, status } = result;
    
    response.setStatusCode(status);
    response.setBody({ success, callProperties });
    callback(null, response);
  } catch (error) {
    handleError(error);
  }
});