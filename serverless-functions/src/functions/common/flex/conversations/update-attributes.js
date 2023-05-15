const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const ConversationsOperations = require(Runtime.getFunctions()['common/twilio-wrappers/conversations'].path);

const requiredParameters = [
  { key: 'conversationSid', purpose: 'conversation to be updated' },
  { key: 'attributes', purpose: 'new attributes' },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { conversationSid, attributes } = event;

    const result = await ConversationsOperations.updateAttributes({
      context,
      conversationSid,
      attributes,
    });

    response.setStatusCode(result.status);
    response.setBody({ ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
