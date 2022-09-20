const TokenValidator = require("twilio-flex-token-validator").functionValidator;
const ParameterValidator = require(Runtime.getFunctions()[
  "common/helpers/parameter-validator"
].path);
const TaskOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/taskrouter"
].path);

exports.handler = TokenValidator(async function createCallbackFlex(
  context,
  event,
  callback
) {
  const scriptName = arguments.callee.name;
  const response = new Twilio.Response();
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
  const parameterError = ParameterValidator.validate(
    context.PATH,
    event,
    requiredParameters
  );

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST");
  response.appendHeader("Content-Type", "application/json");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  if (Object.keys(event).length === 0) {
    console.log("Empty event object, likely an OPTIONS request");
    return callback(null, response);
  }

  if (parameterError) {
    response.setStatusCode(400);
    response.setBody({ data: null, message: parameterError });
    callback(null, response);
  } else {
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
        scriptName,
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
      console.log(error);
      response.setStatusCode(500);
      response.setBody({ data: null, message: error.message });
      callback(null, response);
    }
  }
});
