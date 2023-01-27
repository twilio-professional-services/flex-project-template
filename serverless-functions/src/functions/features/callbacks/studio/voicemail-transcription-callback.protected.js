// Handles transcription completed callback from Twilio Studio, and creates the voicemail task
exports.handler = async function (context, event, callback) {
  const client = context.getTwilioClient();

  console.log("In transcription completed callback");
  const path =
    Runtime.getFunctions()["features/callbacks/studio/create-callback"].path;
  const createCallbackOrVoicemail = require(path);
  return createCallbackOrVoicemail.handler(context, event, callback);
};
