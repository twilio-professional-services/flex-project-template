const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [{ key: 'conversationSid', purpose: 'conversation to be updated' }];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { conversationSid } = event;

    const result = await twilioExecute(context, (client) =>
      client.conversations.v1.conversations(conversationSid).participants.list({ limit: 100 }),
    );
    response.setStatusCode(result.status);
    response.setBody({ result, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
