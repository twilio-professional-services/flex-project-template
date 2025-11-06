const TaskOperations = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);

exports.createCallbackTask = async (parameters) => {
  const {
    context,
    originalTask,
    numberToCall,
    numberToCallFrom,
    flexFlowSid,
    overriddenWorkflowSid,
    overriddenTimeout,
    overriddenPriority,
    retryAttempt,
    conversation_id,
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
  const workflowSid =
    overriddenWorkflowSid || originalTask?.workflowSid || process.env.TWILIO_FLEX_CALLBACK_WORKFLOW_SID;
  const timeout = overriddenTimeout || originalTask?.timeout || 86400;
  const priority = overriddenPriority || originalTask?.priority || 0;
  const attempts = retryAttempt || originalTask?.attributes?.callBackData?.attempts + 1 || 0;
  const taskChannel = overriddenTaskChannel || originalTask?.taskChannelUniqueName || 'voice';
  const taskType = recordingSid || originalTask?.attributes?.callBackData?.recordingSid ? 'voicemail' : 'callback';
  const mainTimeZone =
    originalTask?.attributes?.callBackData?.mainTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  // setup required task attributes for task
  // use provided values, fall back to original task if provided
  const attributes = {
    ...originalTask?.attributes,
    ...(numberToCall ? { from: numberToCall, name: numberToCall } : {}),
    ...(flexFlowSid ? { flow_execution_sid: flexFlowSid } : {}),
    taskType,
    callBackData: {
      ...originalTask?.attributes?.callBackData,
      ...(numberToCall ? { numberToCall } : {}),
      ...(numberToCallFrom ? { numberToCallFrom } : {}),
      ...(recordingSid ? { recordingSid } : {}),
      ...(recordingUrl ? { recordingUrl } : {}),
      ...(transcriptSid ? { transcriptSid } : {}),
      ...(transcriptText ? { transcriptText } : {}),
      mainTimeZone,
      utcDateTimeReceived:
        utcDateTimeReceived || originalTask?.attributes?.callBackData?.utcDateTimeReceived || new Date(),
      isDeleted: isDeleted || originalTask?.attributes?.callBackData?.isDeleted || false,
      attempts,
    },
    direction: 'inbound',
    conversations: {
      ...originalTask?.attributes?.conversations,
      conversation_id: conversation_id || originalTask?.attributes?.conversations?.conversation_id || originalTask?.sid,
    },
  };

  // Remove attributes we definitely don't want to persist to the new task
  delete attributes.call_sid;
  delete attributes.reservation_attributes;
  delete attributes.conference;
  delete attributes.conversations?.abandoned;
  delete attributes.conversations?.hang_up_by;

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
