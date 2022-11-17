const { prepareFlexFunction } = require(Runtime.getFunctions()["common/helpers/prepare-function"].path);
const InteractionsOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/interactions"
].path);

const requiredParameters = [
  {
    key: "taskSid",
    purpose: "task sid of transferring task",
  },
  {
    key: "conversationId",
    purpose: "for linking transfer task in insights (CHxxx or WTxxx sid)",
  },
  {
    key: "jsonAttributes",
    purpose: "string representation of transferring task",
  },
  {
    key: "transferTargetSid",
    purpose: "worker or queue sid",
  },
  {
    key: "transferQueueName",
    purpose:
      "friendly name of taskrouter queue - can be empty string if transferTargetSid is a worker sid",
  },
  {
    key: "ignoreWorkerContactUri",
    purpose:
      "contact_uri from workers attributes that transferred the task. we don't want to give them back the transferred task",
  },
  {
    key: "flexInteractionSid",
    purpose: "KDxxx sid for inteactions API",
  },
  {
    key: "flexInteractionChannelSid",
    purpose: "UOxxx sid for interactions API",
  },
  {
    key: "flexInteractionParticipantSid",
    purpose:
      "UTxxx sid for interactions API for the transferrring agent to remove them from conversation",
  },
];

const getRoutingParams = (
  context,
  conversationId,
  jsonAttributes,
  transferTargetSid,
  transferQueueName,
  ignoreWorkerContactUri
) => {
  const originalTaskAttributes = JSON.parse(jsonAttributes);
  const newAttributes = {
    ...originalTaskAttributes,
    ignoreWorkerContactUri,
    transferTargetSid,
    transferQueueName,
    transferTargetType: transferTargetSid.startsWith("WK") ? "worker" : "queue",
    conversations: {
      ...originalTaskAttributes.conversations,
      conversation_id: conversationId,
    },
  };

  const routingParams = {
    properties: {
      task_channel_unique_name: "chat",
      workspace_sid: context.TWILIO_FLEX_WORKSPACE_SID,
      workflow_sid: context.TWILIO_FLEX_CHAT_TRANSFER_WORKFLOW_SID,
      attributes: newAttributes,
    },
  };

  return routingParams;
};

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    if (
      !context.TWILIO_FLEX_WORKSPACE_SID ||
      !context.TWILIO_FLEX_CHAT_TRANSFER_WORKFLOW_SID
    ) {
      response.setStatusCode(400);
      response.setBody({
        data: null,
        message:
          "TWILIO_FLEX_WORKSPACE_SID and TWILIO_FLEX_CHAT_TRANSFER_WORKFLOW_SID required enviroment variables",
      });
      callback(null, response);
      return;
    }
    
    const {
      conversationId,
      jsonAttributes,
      transferTargetSid,
      transferQueueName,
      ignoreWorkerContactUri,
      flexInteractionSid,
      flexInteractionChannelSid,
      flexInteractionParticipantSid,
    } = event;
    
    const routingParams = getRoutingParams(
      context,
      conversationId,
      jsonAttributes,
      transferTargetSid,
      transferQueueName,
      ignoreWorkerContactUri
    );
    
    const participantCreateInviteParams = {
      routing: routingParams,
      interactionSid: flexInteractionSid,
      channelSid: flexInteractionChannelSid,
      context,
      attempts: 0,
    };
    
    let {
      success,
      status,
      message = "",
      participantInvite = null,
    } = await InteractionsOperations.participantCreateInvite(
      participantCreateInviteParams
    );
    
    // if this failed bail out so we don't remove the agent from the conversation and no one else joins
    if (!success) {
      return sendErrorReply(callback, response, context.PATH, status, message);
    }
    
    await InteractionsOperations.participantUpdate({
      status: "closed",
      interactionSid: flexInteractionSid,
      channelSid: flexInteractionChannelSid,
      participantSid: flexInteractionParticipantSid,
      context,
      attempts: 0,
    });
    
    response.setStatusCode(201);
    response.setBody({
      success: true,
      message: `Participant invite ${participantInvite.sid}`,
    });
    callback(null, response);
  } catch (error) {
    handleError(error);
  }
});

const sendErrorReply = (callback, response, scriptName, status, message) => {
  console.error(`Unexpected error occurred in ${scriptName}: ${message}`);
  response.setStatusCode(status);
  response.setBody({ success: false, message });
  callback(null, response);
};