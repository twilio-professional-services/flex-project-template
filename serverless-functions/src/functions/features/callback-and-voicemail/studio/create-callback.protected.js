const { prepareStudioFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const CallbackOperations = require(Runtime.getFunctions()['features/callback-and-voicemail/common/callback-operations']
  .path);

const requiredParameters = [
  { key: 'numberToCall', purpose: 'the number of the customer to call' },
  {
    key: 'numberToCallFrom',
    purpose: 'the number to call the customer from',
  },
];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const {
      numberToCall,
      numberToCallFrom,
      flexFlowSid,
      workflowSid: overriddenWorkflowSid,
      timeout: overriddenTimeout,
      priority: overriddenPriority,
      attempts: retryAttempt,
      conversation_id,
      message,
      utcDateTimeReceived,
      recordingSid,
      RecordingSid,
      recordingUrl,
      RecordingUrl,
      transcriptSid,
      TranscriptionSid,
      transcriptText,
      TranscriptionText,
      isDeleted,
      taskChannel: overriddenTaskChannel,
    } = event;

    const result = await CallbackOperations.createCallbackTask({
      context,
      numberToCall,
      numberToCallFrom,
      flexFlowSid,
      overriddenWorkflowSid,
      overriddenTimeout,
      overriddenPriority,
      retryAttempt,
      conversation_id,
      message,
      utcDateTimeReceived,
      recordingSid: recordingSid || RecordingSid,
      recordingUrl: recordingUrl || RecordingUrl,
      transcriptSid: transcriptSid || TranscriptionSid,
      transcriptText: transcriptText || TranscriptionText,
      isDeleted,
      overriddenTaskChannel,
    });

    const { status, taskSid } = result;
    response.setStatusCode(status);
    response.setBody({ taskSid, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
