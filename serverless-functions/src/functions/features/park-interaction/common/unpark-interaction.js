const { prepareStudioFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const ConversationsOperations = require(Runtime.getFunctions()['common/twilio-wrappers/conversations'].path);
const InteractionsOperations = require(Runtime.getFunctions()['common/twilio-wrappers/interactions'].path);

const requiredParameters = [{ key: 'ConversationSid', purpose: 'conversation sid' }];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const conversationSid = event.ConversationSid;
    const webhookSid = event.WebhookSid;

    // Remove webhook so it doesn't keep triggering if parked more than once
    ConversationsOperations.removeWebhook({
      context,
      conversationSid,
      webhookSid,
    });

    // Fetch the conversation attributes updated when parked
    const conversation = await ConversationsOperations.getConversation({
      conversationSid,
      context,
    });
    const {
      interactionSid,
      channelSid,
      taskAttributes,
      taskChannelUniqueName,
      queueName,
      queueSid,
      workerSid,
      workflowSid,
    } = JSON.parse(conversation.conversation.attributes);

    // Create a new task through the invites endpoint. Alternatively you can pass
    // a queue_sid and a worker_sid inside properties to add a specific agent back to the interaction
    const result = await InteractionsOperations.participantCreateInvite({
      context,
      interactionSid,
      channelSid,
      routing: {
        properties: {
          workspace_sid: context.TWILIO_FLEX_WORKSPACE_SID,
          workflow_sid: workflowSid,
          task_channel_unique_name: taskChannelUniqueName,
          attributes: { ...JSON.parse(taskAttributes), originalRouting: { queueName, queueSid, workerSid } },
        },
      },
    });

    const { participantInvite, status } = result;
    response.setStatusCode(status);
    response.setBody({ participantInvite, ...extractStandardResponse(result) });

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
