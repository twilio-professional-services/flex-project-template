const { prepareFlexFunction } = require(Runtime.getFunctions()[
  "common/helpers/prepare-function"
].path);
const TaskOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/taskrouter"
].path);
const CallbackOperations = require(Runtime.getFunctions()[
  "features/callback-and-voicemail/common/callback-operations"
].path);

const requiredParameters = [
  { key: "numberToCall", purpose: "the number of the customer to call" },
  {
    key: "numberToCallFrom",
    purpose: "the number to call the customer from",
  },
];

exports.handler = prepareFlexFunction(
  requiredParameters,
  async (context, event, callback, response, handleError) => {
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
        recordingUrl,
        transcriptSid,
        transcriptText,
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
        recordingSid: recordingSid,
        recordingUrl: recordingUrl,
        transcriptSid: transcriptSid,
        transcriptText: transcriptText,
        isDeleted,
        overriddenTaskChannel,
      });
      response.setStatusCode(result.status);
      response.setBody({ success: result.success, taskSid: result.taskSid });
      callback(null, response);
    } catch (error) {
      handleError(error);
    }
  }
);
