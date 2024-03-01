const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [
  { key: 'channelSid', purpose: 'channel to be updated' },
  { key: 'attributes', purpose: 'new attributes' },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { channelSid, attributes } = event;

    const result = await twilioExecute(context, (client) =>
      client.chat.v2.services(context.TWILIO_FLEX_CHAT_SERVICE_SID).channels(channelSid).update({ attributes }),
    );

    response.setStatusCode(result.status);
    response.setBody({ ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
