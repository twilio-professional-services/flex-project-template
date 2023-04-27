const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
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
    });

    response.setStatusCode(result.status);
    response.setBody({ ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
