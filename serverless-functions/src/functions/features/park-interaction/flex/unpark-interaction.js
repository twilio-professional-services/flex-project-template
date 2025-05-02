const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const UnparkOperations = require(Runtime.getFunctions()['features/park-interaction/common/unpark-operations'].path);

const requiredParameters = [{ key: 'ConversationSid', purpose: 'conversation sid' }];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const conversationSid = event.ConversationSid;
    const webhookSid = event.WebhookSid;
    // RouteToSameWorker is only set when worker is unparking
    const routeToSameWorker = event.RouteToSameWorker === 'true';

    const result = await UnparkOperations.unparkInteraction(context, conversationSid, webhookSid, routeToSameWorker);

    response.setStatusCode(result.status);
    response.setBody(result);

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
