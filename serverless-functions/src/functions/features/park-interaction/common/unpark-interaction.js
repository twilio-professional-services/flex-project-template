const { prepareStudioFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const ConversationsOperations = require(Runtime.getFunctions()['common/twilio-wrappers/conversations'].path);
const InteractionsOperations = require(Runtime.getFunctions()['common/twilio-wrappers/interactions'].path);
const SyncOperations = require(Runtime.getFunctions()['common/twilio-wrappers/sync'].path);

const requiredParameters = [{ key: 'ConversationSid', purpose: 'conversation sid' }];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const conversationSid = event.ConversationSid;
    const webhookSid = event.WebhookSid;
    // RouteToSameWorker is only set when worker is unparking
    const routeToSameWorker = event.RouteToSameWorker === 'true';

    // Remove webhook so it doesn't keep triggering if parked more than once
    const webhookResult = await ConversationsOperations.removeWebhook({
      context,
      conversationSid,
      webhookSid,
    });
    if (!webhookResult.success) throw webhookResult.message;

    // Fetch the conversation attributes updated when parked
    const conversation = await ConversationsOperations.getConversation({
      conversationSid,
      context,
    });
    if (!conversation.success) throw conversation.message;
    const {
      interactionSid,
      channelSid,
      taskAttributes,
      taskChannelUniqueName,
      queueName,
      queueSid,
      workerSid,
      workflowSid,
      mapSid,
      mapItemKey,
    } = JSON.parse(conversation.conversation.attributes);

    // Create a new task through the invites endpoint. Alternatively you can pass
    // a queue_sid and a worker_sid inside properties to add a specific agent back to the interaction

    const additionalProperties = {};
    if (routeToSameWorker) {
      additionalProperties.queue_sid = queueSid;
      additionalProperties.worker_sid = workerSid;
    }
    const result = await InteractionsOperations.participantCreateInvite({
      context,
      interactionSid,
      channelSid,
      routing: {
        properties: {
          workspace_sid: context.TWILIO_FLEX_WORKSPACE_SID,
          workflow_sid: workflowSid,
          ...additionalProperties,
          task_channel_unique_name: taskChannelUniqueName,
          attributes: { ...JSON.parse(taskAttributes), originalRouting: { queueName, queueSid, workerSid } },
        },
      },
    });

    if (mapSid && mapItemKey) {
      await SyncOperations.deleteMapItem({
        context,
        mapSid,
        key: mapItemKey,
      });
    }

    const { participantInvite, status } = result;
    response.setStatusCode(status);
    response.setBody({ participantInvite, ...extractStandardResponse(result) });

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
