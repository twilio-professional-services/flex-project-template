const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [
  { key: 'conversationSid', purpose: 'conversation to be updated' },
  { key: 'myWorkerName', purpose: 'worker to add to the conversation' },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { conversationSid, myWorkerName } = event;

    const result = await twilioExecute(context, (client) =>
      client.conversations.v1.conversations(conversationSid).participants.create({
        identity: myWorkerName,
      }),
    );

    response.setStatusCode(result.status);
    response.setBody({ ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
