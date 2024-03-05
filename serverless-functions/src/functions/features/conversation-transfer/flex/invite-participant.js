const { prepareFlexFunction, twilioExecute } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);

const requiredParameters = [
  {
    key: 'taskSid',
    purpose: 'task sid of transferring task',
  },
  {
    key: 'conversationId',
    purpose: 'for linking transfer task in insights (CHxxx or WTxxx sid)',
  },
  {
    key: 'jsonAttributes',
    purpose: 'string representation of transferring task',
  },
  {
    key: 'transferTargetSid',
    purpose: 'worker or queue sid',
  },
  {
    key: 'workersToIgnore',
    purpose:
      "json object with key indicating task attribute to set as an array of workers to ignore. eg {'workersToIgnore':['Alice','Bob']}. This gets copied to task attributes.",
  },
  {
    key: 'flexInteractionSid',
    purpose: 'KDxxx sid for inteactions API',
  },
  {
    key: 'flexInteractionChannelSid',
    purpose: 'UOxxx sid for interactions API',
  },
];

const getRoutingParams = (
  context,
  conversationId,
  jsonAttributes,
  transferTargetSid,
  transferQueueName,
  workersToIgnore,
) => {
  const originalTaskAttributes = JSON.parse(jsonAttributes);
  const newAttributes = {
    ...originalTaskAttributes,
    ...JSON.parse(workersToIgnore),
    transferTargetSid,
    transferQueueName,
    transferTargetType: transferTargetSid.startsWith('WK') ? 'worker' : 'queue',
    conversations: {
      ...originalTaskAttributes.conversations,
      conversation_id: conversationId,
    },
  };

  return {
    properties: {
      task_channel_unique_name: 'chat',
      workspace_sid: context.TWILIO_FLEX_WORKSPACE_SID,
      workflow_sid: context.TWILIO_FLEX_CHAT_TRANSFER_WORKFLOW_SID,
      attributes: newAttributes,
    },
  };
};

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  if (!context.TWILIO_FLEX_WORKSPACE_SID || !context.TWILIO_FLEX_CHAT_TRANSFER_WORKFLOW_SID) {
    response.setStatusCode(400);
    response.setBody({
      data: null,
      message: 'TWILIO_FLEX_WORKSPACE_SID and TWILIO_FLEX_CHAT_TRANSFER_WORKFLOW_SID required enviroment variables',
    });
    return callback(null, response);
  }

  try {
    const {
      conversationId,
      conversationSid,
      jsonAttributes,
      transferTargetSid,
      transferQueueName,
      transferWorkerName,
      workersToIgnore,
      flexInteractionSid,
      flexInteractionChannelSid,
      removeFlexInteractionParticipantSid,
    } = event;

    const routingParams = getRoutingParams(
      context,
      conversationId,
      jsonAttributes,
      transferTargetSid,
      transferQueueName,
      workersToIgnore,
    );

    const {
      success,
      message = '',
      data: participantInvite = null,
    } = await twilioExecute(context, (client) =>
      client.flexApi.v1.interaction(flexInteractionSid).channels(flexInteractionChannelSid).invites.create({
        routing: routingParams,
      }),
    );

    // if this failed bail out so we don't remove the agent from the conversation and no one else joins
    if (!success) {
      return handleError(message);
    }

    if (removeFlexInteractionParticipantSid) {
      await twilioExecute(context, (client) =>
        client.flexApi.v1
          .interaction(flexInteractionSid)
          .channels(flexInteractionChannelSid)
          .participants(removeFlexInteractionParticipantSid)
          .update({ status: 'closed' }),
      );
    } else {
      // Add invite to conversation attributes
      const inviteTargetType = transferTargetSid.startsWith('WK') ? 'Worker' : 'Queue';
      const conversation = await twilioExecute(context, (client) =>
        client.conversations.v1.conversations(conversationSid).fetch(),
      );
      const currentAttributes = JSON.parse(conversation.data.attributes);
      await twilioExecute(context, (client) =>
        client.conversations.v1.conversations(conversationSid).update({
          attributes: JSON.stringify({
            ...currentAttributes,
            invites: {
              ...currentAttributes.invites,
              [participantInvite.routing.properties.sid]: {
                invitesTaskSid: participantInvite.routing.properties.sid,
                targetSid: transferTargetSid,
                timestampCreated: new Date(),
                targetName: inviteTargetType === 'Queue' ? transferQueueName : transferWorkerName,
                inviteTargetType,
              },
            },
          }),
        }),
      );
    }

    response.setStatusCode(200);
    response.setBody({
      success: true,
      message: `Participant invite ${participantInvite.sid}`,
      participantInviteSid: participantInvite.sid,
      invitesTaskSid: participantInvite.routing.properties.sid,
    });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
