const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [{ key: 'address', purpose: 'contact address' }];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { address } = event;
    const result = await twilioExecute(context, (client) =>
      client.conversations.v1.participantConversations.list({
        address,
      }),
    );

    const { data: conversations } = result;
    response.setStatusCode(result.status);
    response.setBody({ conversations, ...extractStandardResponse(result) });

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
