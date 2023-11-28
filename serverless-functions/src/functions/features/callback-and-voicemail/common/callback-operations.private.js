const TaskOperations = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);

exports.createCallbackTask = async (parameters) => {
  const {
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
    recordingSid,
    recordingUrl,
    transcriptSid,
    transcriptText,
    isDeleted,
    overriddenTaskChannel,
    virtualStartTime,
  } = parameters;

  // use assigned values or use defaults
  const workflowSid = overriddenWorkflowSid || process.env.TWILIO_FLEX_CALLBACK_WORKFLOW_SID;
  const timeout = overriddenTimeout || 86400;
  const priority = overriddenPriority || 0;
  const attempts = retryAttempt || 0;
  const taskChannel = overriddenTaskChannel || 'voice';

  // setup required task attributes for task
  const attributes = {
    taskType: recordingSid ? 'voicemail' : 'callback',
    from: numberToCall,
    name: numberToCall,
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
    direction: 'inbound',
    conversations: {
      conversation_id,
    },
  };

  return TaskOperations.createTask({
    context,
    workflowSid,
    taskChannel,
    attributes,
    priority,
    timeout,
    virtualStartTime,
  });
};
