const { prepareStudioFunction } = require(Runtime.getFunctions()[
  "common/helpers/prepare-function"
].path);
const TaskOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/taskrouter"
].path);

const requiredParameters = [
  { key: "numberToCall", purpose: "the number of the customer to call" },
  {
    key: "numberToCallFrom",
    purpose: "the number to call the customer from",
  },
];

exports.handler = prepareStudioFunction(
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

      // use assigned values or use defaults
      const workflowSid =
        overriddenWorkflowSid || process.env.TWILIO_FLEX_CALLBACK_WORKFLOW_SID;
      const timeout = overriddenTimeout || 86400;
      const priority = overriddenPriority || 0;
      const attempts = retryAttempt || 0;
      const taskChannel = overriddenTaskChannel || "voice";

      // use explicitly passed in values or use values from the transcription callback event (if applicable)
      const definitiveRecordingSid = recordingSid || RecordingSid;
      const definitiveRecordingUrl = recordingUrl || RecordingUrl;
      const definitiveTranscriptionSid = transcriptSid || TranscriptionSid;
      const definitiveTranscriptionText =
        transcriptText || TranscriptionText;

      // setup required task attributes for task
      const attributes = {
        taskType: definitiveRecordingSid ? "voicemail" : "callback",
        name:
          (definitiveRecordingSid ? "Voicemail" : "Callback") +
          ` (${numberToCall})`,
        flow_execution_sid: flexFlowSid,
        message: message || null,
        callBackData: {
          numberToCall,
          numberToCallFrom,
          attempts,
          mainTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          utcDateTimeReceived: utcDateTimeReceived || new Date(),
          recordingSid: definitiveRecordingSid,
          recordingUrl: definitiveRecordingUrl,
          transcriptSid: definitiveTranscriptionSid,
          transcriptText: definitiveTranscriptionText,
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
  }
);
