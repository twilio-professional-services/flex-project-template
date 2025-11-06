const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [
  { key: 'conversationSid', purpose: 'conversation to be updated' },
  { key: 'attributes', purpose: 'new attributes' },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { conversationSid, attributes } = event;

    const result = await twilioExecute(context, (client) =>
      client.conversations.v1.conversations(conversationSid).update({ attributes }),
    );

    response.setStatusCode(result.status);
    response.setBody({ ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
