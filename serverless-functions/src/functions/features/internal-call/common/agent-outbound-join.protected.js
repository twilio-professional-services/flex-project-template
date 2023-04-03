exports.handler = (context, event, callback) => {
  const twiml = new Twilio.twiml.VoiceResponse();

  twiml.dial().conference(
    {
      statusCallback: 'call-outbound-join',
      statusCallbackEvent: 'join end',
      endConferenceOnExit: true,
    },
    event.taskSid,
  );

  return callback(null, twiml);
};
