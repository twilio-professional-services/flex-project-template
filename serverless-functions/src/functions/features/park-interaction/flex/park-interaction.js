const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const ConversationsOperations = require(Runtime.getFunctions()['common/twilio-wrappers/conversations'].path);
const InteractionsOperations = require(Runtime.getFunctions()['common/twilio-wrappers/interactions'].path);
const SyncClient = require('twilio-sync').Client;

const syncToken = require(Runtime.getFunctions()['common/twilio-wrappers/get-sync-token'].path);

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
  { key: 'workerName', purpose: 'agent worker name' },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const sync = await syncToken.getSyncToken(context);
  const syncClient = new SyncClient(sync.token);
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
      workerName,
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

      // Open a Sync Map by unique name and update its data
      await syncClient
        .map(workerName)
        .then(async (map) => {
          console.log('Successfully added/updated a map. SID:', map.sid);
          try {
            await map.set(
              conversationSid,
              {
                interactionSid,
                flexInteractionChannelSid: channelSid,
                participantSid,
                workflowSid,
                taskChannelUniqueName,
                taskAttributes,
                webhookSid: webhookResult.webhook.sid,
              },
              { ttl: 86400 },
            );
          } catch (error) {
            console.error('#### Sync - add Map Item failed', error);
          }
          map.on('itemUpdated', (updatedEvent) => {
            console.log('Received an "itemUpdated" event:', updatedEvent);
          });
        })
        .catch((error) => {
          console.error('Unexpected error adding a MAP', error);
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
