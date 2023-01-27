// Handles transcription completed callback from Twilio Studio, and creates the voicemail task
exports.handler = async function (context, event, callback) {
  const client = context.getTwilioClient();

  const path =
    Runtime.getFunctions()["features/callbacks/studio/create-callback"].path;
  const createCallbackOrVoicemail = require(path);

  event.recordingSid = event.RecordingSid;
  event.recordingUrl = event.RecordingUrl;
  event.transcribeText = event.TranscriptionText;
  event.transcribeUrl = event.TranscriptionUrl;

  return createCallbackOrVoicemail.handler(context, event, callback);
};
