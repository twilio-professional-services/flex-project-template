const { extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()['common/helpers/function-helper']
  .path);

exports.unparkInteraction = async (context, conversationSid, webhookSid, routeToSameWorker) => {
  // Remove webhook so it doesn't keep triggering if parked more than once
  const webhookResult = await twilioExecute(context, (client) =>
    client.conversations.v1.conversations(conversationSid).webhooks(webhookSid).remove(),
  );
  if (!webhookResult.success) throw webhookResult.message;

  // Fetch the conversation attributes updated when parked
  const conversation = await twilioExecute(context, (client) =>
    client.conversations.v1.conversations(conversationSid).fetch(),
  );
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
  } = JSON.parse(conversation.data.attributes);

  // Create a new task through the invites endpoint. Alternatively you can pass
  // a queue_sid and a worker_sid inside properties to add a specific agent back to the interaction

  const additionalProperties = {};
  if (routeToSameWorker) {
    additionalProperties.queue_sid = queueSid;
    additionalProperties.worker_sid = workerSid;
  }
  const result = await twilioExecute(context, (client) =>
    client.flexApi.v1
      .interaction(interactionSid)
      .channels(channelSid)
      .invites.create({
        routing: {
          properties: {
            workspace_sid: context.TWILIO_FLEX_WORKSPACE_SID,
            workflow_sid: workflowSid,
            ...additionalProperties,
            task_channel_unique_name: taskChannelUniqueName,
            attributes: { ...JSON.parse(taskAttributes), originalRouting: { queueName, queueSid, workerSid } },
          },
        },
      }),
  );

  if (mapSid && mapItemKey) {
    await twilioExecute(context, (client) =>
      client.sync.services(context.TWILIO_FLEX_SYNC_SID).syncMaps(mapSid).syncMapItems(mapItemKey).remove(),
    );
  }

  const { data: participantInvite, status } = result;
  return { status, participantInvite, ...extractStandardResponse(result) };
};
