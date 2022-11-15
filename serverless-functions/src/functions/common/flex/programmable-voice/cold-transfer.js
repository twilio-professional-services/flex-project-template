const { prepareFlexFunction } = require(Runtime.getFunctions()["common/helpers/prepare-function"].path);
const VoiceOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/programmable-voice"
].path);

const requiredParameters = [
  { key: "callSid", purpose: "unique ID of call to update" },
  { key: "to", purpose: "phone number to transfer to" },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { callSid, to } = event;
    
    const result = await VoiceOperations.coldTransfer({
      context,
      callSid,
      to,
      attempts: 0,
    });
    
    const { success, status } = result;
    
    response.setStatusCode(status);
    response.setBody({ success });
    callback(null, response);
  } catch (error) {
    handleError(error);
  }
});