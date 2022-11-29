exports.handler = (context, event, callback) => {
  let twiml = new Twilio.twiml.VoiceResponse();
  twiml.say();
  callback(null, twiml);
};