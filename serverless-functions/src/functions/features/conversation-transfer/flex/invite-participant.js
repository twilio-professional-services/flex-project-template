const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const ConversationsOperations = require(Runtime.getFunctions()['common/twilio-wrappers/conversations'].path);
const InteractionsOperations = require(Runtime.getFunctions()['common/twilio-wrappers/interactions'].path);

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

    const participantCreateInviteParams = {
      routing: routingParams,
      interactionSid: flexInteractionSid,
      channelSid: flexInteractionChannelSid,
      context,
    };

    const {
      success,
      message = '',
      participantInvite = null,
    } = await InteractionsOperations.participantCreateInvite(participantCreateInviteParams);

    // if this failed bail out so we don't remove the agent from the conversation and no one else joins
    if (!success) {
      return handleError(message);
    }

    if (removeFlexInteractionParticipantSid) {
      await InteractionsOperations.participantUpdate({
        status: 'closed',
        interactionSid: flexInteractionSid,
        channelSid: flexInteractionChannelSid,
        participantSid: removeFlexInteractionParticipantSid,
        context,
      });
    } else {
      // Add invite to conversation attributes
      const inviteTargetType = transferTargetSid.startsWith('WK') ? 'Worker' : 'Queue';
      const conversation = await ConversationsOperations.getConversation({
        conversationSid,
        context,
      });
      const currentAttributes = JSON.parse(conversation.conversation.attributes);
      await ConversationsOperations.updateAttributes({
        conversationSid,
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
        context,
      });
    }

    response.setStatusCode(201);
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
