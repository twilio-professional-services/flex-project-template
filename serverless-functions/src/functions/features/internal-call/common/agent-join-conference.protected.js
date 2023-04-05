exports.handler = (context, event, callback) => {
  const twiml = new Twilio.twiml.VoiceResponse();

  twiml.dial().conference(
    {
      endConferenceOnExit: true,
    },
    event.conferenceName,
  );

  return callback(null, twiml);
};
