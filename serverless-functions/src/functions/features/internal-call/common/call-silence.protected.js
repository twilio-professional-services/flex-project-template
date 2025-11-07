exports.handler = (context, event, callback) => {
  const twiml = new Twilio.twiml.VoiceResponse();
  twiml.say();
  twiml.pause({ length: 5 });
  callback(null, twiml);
};
