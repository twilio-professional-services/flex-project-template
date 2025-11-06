const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const VoiceOperations = require(Runtime.getFunctions()['common/twilio-wrappers/programmable-voice'].path);

const requiredParameters = [{ key: 'recordingSid', purpose: 'recording sid to fetch' }];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const { recordingSid } = event;

  try {
    const result = await VoiceOperations.fetchRecordingMedia({
      context,
      recordingSid,
    });

    const { data, status } = result;
    response.setStatusCode(status);
    response.setBody({ ...data });

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
