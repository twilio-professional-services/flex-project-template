const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const ChatOperations = require(Runtime.getFunctions()['common/twilio-wrappers/programmable-chat'].path);

const requiredParameters = [
  { key: 'channelSid', purpose: 'channel to be updated' },
  { key: 'attributes', purpose: 'new attributes' },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { channelSid, attributes } = event;
    console.log(attributes);
    const result = await ChatOperations.updateChannelAttributes({
      context,
      channelSid,
      attributes,
      attempts: 0,
    });

    const { status, success, message, twilioDocPage, twilioErrorCode } = result;

    response.setStatusCode(status);
    response.setBody({ success, message, twilioDocPage, twilioErrorCode });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
