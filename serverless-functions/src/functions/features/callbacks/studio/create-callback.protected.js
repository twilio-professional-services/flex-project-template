const { prepareStudioFunction } = require(Runtime.getFunctions()["common/helpers/prepare-function"].path);
const TaskOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/taskrouter"
].path);

const requiredParameters = [
  { key: "numberToCall", purpose: "the number of the customer to call" },
  {
    key: "numberToCallFrom",
    purpose: "the number to call the customer from",
  },
  {
    key: "flexFlowSid",
    purpose: "the SID of the Flex Flow that triggered this function",
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
      recordingUrl,
      transcriptSid,
      transcriptText,
      isDeleted,
      taskChannel: overriddenTaskChannel,
    } = event;
    
    // use assigned values or use defaults
    const workflowSid =
      overriddenWorkflowSid || process.env.TWILIO_FLEX_CALLBACK_WORKFLOW_SID;
    const timeout = overriddenTimeout || 86400;
    const priority = overriddenPriority || 0;
    const attempts = retryAttempt || 0;
    const taskChannel = overriddenTaskChannel || "voice";
    
    // setup required task attributes for task
    const attributes = {
      taskType: recordingSid ? "voicemail" : "callback",
      name: (recordingSid ? "Voicemail" : "Callback") + ` (${numberToCall})`,
      flow_execution_sid: flexFlowSid,
      message: message || null,
      callBackData: {
        numberToCall,
        numberToCallFrom,
        attempts,
        mainTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        utcDateTimeReceived: utcDateTimeReceived || new Date(),
        recordingSid,
        recordingUrl,
        transcriptSid,
        transcriptText,
        isDeleted: isDeleted || false,
      },
      direction: "inbound",
      conversations: {
        conversation_id,
      },
    };
    
    const result = await TaskOperations.createTask({
      context,
      workflowSid,
      taskChannel,
      attributes,
      priority,
      timeout,
      attempts: 0,
    });
    response.setStatusCode(result.status);
    response.setBody({ success: result.success, taskSid: result.taskSid });
    callback(null, response);
  } catch (error) {
    handleError(error);
  }
});