const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [
  { key: 'channelSid', purpose: 'interaction channel sid' },
  { key: 'interactionSid', purpose: 'interaction sid' },
  { key: 'participantSid', purpose: 'agent participant sid' },
  { key: 'conversationSid', purpose: 'conversation sid' },
  { key: 'channelType', purpose: 'channel type' },
  { key: 'taskSid', purpose: 'task sid' },
  { key: 'workflowSid', purpose: 'workflow sid' },
  { key: 'taskChannelUniqueName', purpose: 'task channel unique name' },
  { key: 'queueName', purpose: 'current queue name' },
  { key: 'queueSid', purpose: 'current queue sid' },
  { key: 'taskAttributes', purpose: 'task attributes to copy' },
  { key: 'workerSid', purpose: 'agent worker sid' },
  { key: 'createUpdateSyncMapItem', purpose: 'create or update sync map item' },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const {
      channelSid,
      interactionSid,
      participantSid,
      conversationSid,
      channelType,
      taskSid,
      workflowSid,
      taskChannelUniqueName,
      queueName,
      queueSid,
      taskAttributes,
      workerSid,
    } = event;
    const createUpdateSyncMapItem = event.createUpdateSyncMapItem === 'true' || false;

    // Create the webhook
    const webhookResult = await twilioExecute(context, (client) =>
      client.conversations.v1.conversations(conversationSid).webhooks.create({
        'configuration.method': 'POST',
        'configuration.filters': ['onMessageAdded'],
        'configuration.url': `https://${context.DOMAIN_NAME}/features/park-interaction/common/unpark-interaction`,
        target: 'webhook',
      }),
    );
    const { data: webhook, status } = webhookResult;

    if (webhookResult.success) {
      // Remove the agent
      const removeAgentResponse = await twilioExecute(context, (client) =>
        client.flexApi.v1
          .interaction(interactionSid)
          .channels(channelSid)
          .participants(participantSid)
          .update({ status: 'closed' }),
      );
      if (!removeAgentResponse.success) throw removeAgentResponse.message;

      let createMapItem = {};
      if (createUpdateSyncMapItem) {
        // Open a Sync Map by unique name and update its data
        const syncMap = await twilioExecute(context, (client) =>
          client.sync.v1
            .services(context.TWILIO_FLEX_SYNC_SID)
            .syncMaps.create({ uniqueName: `ParkedInteractions_${workerSid}` }),
        );

        // If map already exists, use the unique name to access it
        if (syncMap.data?.sid || workerSid) {
          const createMapItemResponse = await twilioExecute(context, (client) =>
            client.sync.v1
              .services(context.TWILIO_FLEX_SYNC_SID)
              .syncMaps(syncMap.data?.sid || `ParkedInteractions_${workerSid}`)
              .syncMapItems.create({
                key: conversationSid,
                ttl: 86400, // One day
                data: {
                  interactionSid,
                  flexInteractionChannelSid: channelSid,
                  channelType,
                  participantSid,
                  workflowSid,
                  taskChannelUniqueName,
                  taskAttributes,
                  webhookSid: webhook.sid,
                },
              }),
          );
          createMapItem = createMapItemResponse.data;
        }
      }

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
        webhookSid: webhook.sid,
      };

      if (createUpdateSyncMapItem && createMapItem.mapSid && createMapItem.key) {
        attributes.mapSid = createMapItem.mapSid;
        attributes.mapItemKey = createMapItem.key;
      }

      const updateAttributesResponse = await twilioExecute(context, (client) =>
        client.conversations.v1.conversations(conversationSid).update({ attributes: JSON.stringify(attributes) }),
      );
      if (!updateAttributesResponse.success) throw updateAttributesResponse.message;
    }

    response.setStatusCode(status);
    response.setBody({ webhook, ...extractStandardResponse(webhookResult) });

    return callback(null, response);
  } catch (parkingError) {
    return handleError(parkingError);
  }
});
