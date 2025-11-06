const { prepareStudioFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const UnparkOperations = require(Runtime.getFunctions()['features/park-interaction/common/unpark-operations'].path);

const requiredParameters = [{ key: 'ConversationSid', purpose: 'conversation sid' }];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const result = await UnparkOperations.unparkInteraction(context, event.ConversationSid, event.WebhookSid, false);

    response.setStatusCode(result.status);
    response.setBody(result);

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
