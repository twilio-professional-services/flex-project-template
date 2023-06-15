const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const ConversationsOperations = require(Runtime.getFunctions()['common/twilio-wrappers/conversations'].path);
const InteractionsOperations = require(Runtime.getFunctions()['common/twilio-wrappers/interactions'].path);

const requiredParameters = [
  { key: 'channelSid', purpose: 'interaction channel sid' },
  { key: 'interactionSid', purpose: 'interaction sid' },
  { key: 'participantSid', purpose: 'agent participant sid' },
  { key: 'conversationSid', purpose: 'conversation sid' },
  { key: 'taskSid', purpose: 'task sid' },
  { key: 'workflowSid', purpose: 'workflow sid' },
  { key: 'taskChannelUniqueName', purpose: 'task channel unique name' },
  { key: 'queueName', purpose: 'current queue name' },
  { key: 'queueSid', purpose: 'current queue sid' },
  { key: 'taskAttributes', purpose: 'task attributes to copy' },
  { key: 'workerSid', purpose: 'agent worker sid' },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const {
      channelSid,
      interactionSid,
      participantSid,
      conversationSid,
      taskSid,
      workflowSid,
      taskChannelUniqueName,
      queueName,
      queueSid,
      taskAttributes,
      workerSid,
    } = event;

    // Create the webhook
    const webhookResult = await ConversationsOperations.addWebhook({
      context,
      conversationSid,
      method: 'POST',
      filters: ['onMessageAdded'],
      url: `https://${context.DOMAIN_NAME}/features/park-interaction/common/unpark-interaction`,
      target: 'webhook',
    });

    if (webhookResult.success) {
      // Remove the agent
      await InteractionsOperations.participantUpdate({
        context,
        interactionSid,
        channelSid,
        participantSid,
        status: 'closed',
      });

      // update conversation attributes
      const attributes = {
        interactionSid,
        channelSid,
        participantSid,
        taskSid,
        workflowSid,
        taskChannelUniqueName,
        queueName,
        queueSid,
        workerSid,
        taskAttributes,
        webhookSid: webhookResult.webhook.sid,
      };

      await ConversationsOperations.updateAttributes({
        context,
        conversationSid,
        attributes: JSON.stringify(attributes),
      });
    }

    const { webhook, status } = webhookResult;
    response.setStatusCode(status);
    response.setBody({ webhook, ...extractStandardResponse(webhookResult) });

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
