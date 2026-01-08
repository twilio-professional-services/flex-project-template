exports.handler = (context, event, callback) => {
  const { from, callToQueue, conversation_id, worker_sid } = event;
  const attributes = {
    name: from,
    conversations: {
      conversation_id,
    },
  };
  if (worker_sid) {
    attributes.worker_sid = worker_sid;
  } else if (callToQueue) {
    attributes.callToQueue = callToQueue;
  } else {
    return callback('Missing destination');
  }
  const twiml = new Twilio.twiml.VoiceResponse();
  twiml
    .enqueue({
      workflowSid: context.TWILIO_FLEX_INTERNAL_CALL_WORKFLOW_SID,
    })
    .task({}, JSON.stringify(attributes));
  return callback(null, twiml);
};
