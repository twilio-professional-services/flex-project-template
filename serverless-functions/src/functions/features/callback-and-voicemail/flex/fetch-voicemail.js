const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const VoiceOperations = require(Runtime.getFunctions()['common/twilio-wrappers/programmable-voice'].path);

const requiredParameters = [{ key: 'recordingSid', purpose: 'recording sid to fetch' }];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const { recordingSid } = event;

  try {
    const recordingResult = await VoiceOperations.fetchRecording({
      context,
      recordingSid,
    });

    if (!recordingResult.recordingProperties.mediaUrl) {
      return handleError('Missing mediaUrl for provided recording sid');
    }

    const result = await VoiceOperations.fetchRecordingMedia({
      context,
      recordingUrl: recordingResult.recordingProperties.mediaUrl,
    });

    const { recording, status, type } = result;
    response.setStatusCode(status);
    response.setBody({ recording, type });

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
