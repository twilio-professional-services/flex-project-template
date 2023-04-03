const TokenValidator = require('twilio-flex-token-validator').functionValidator;

const ParameterValidator = require(Runtime.getFunctions()['common/helpers/parameter-validator'].path);
const InteractionsOperations = require(Runtime.getFunctions()['common/twilio-wrappers/interactions'].path);

const getRequiredParameters = () => {
  return [
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
};

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

exports.handler = TokenValidator(async function chat_transfer_v2_cbm(context, event, callback) {
  const response = new Twilio.Response();

  const requiredParameters = getRequiredParameters();
  const parameterError = ParameterValidator.validate(context.PATH, event, requiredParameters);

  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (Object.keys(event).length === 0) {
    console.log('Empty event object, likely an OPTIONS request');
    return callback(null, response);
  }

  if (!context.TWILIO_FLEX_WORKSPACE_SID || !context.TWILIO_FLEX_CHAT_TRANSFER_WORKFLOW_SID) {
    response.setStatusCode(400);
    response.setBody({
      data: null,
      message: 'TWILIO_FLEX_WORKSPACE_SID and TWILIO_FLEX_CHAT_TRANSFER_WORKFLOW_SID required enviroment variables',
    });
    return callback(null, response);
  }

  if (parameterError) {
    response.setStatusCode(400);
    response.setBody({ data: null, message: parameterError });
    return callback(null, response);
  }

  try {
    const {
      conversationId,
      jsonAttributes,
      transferTargetSid,
      transferQueueName,
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
      attempts: 0,
    };

    const {
      success,
      status,
      message = '',
      participantInvite = null,
    } = await InteractionsOperations.participantCreateInvite(participantCreateInviteParams);

    // if this failed bail out so we don't remove the agent from the conversation and no one else joins
    if (!success) {
      return sendErrorReply(callback, response, scriptName, status, message);
    }

    if (removeFlexInteractionParticipantSid)
      await InteractionsOperations.participantUpdate({
        status: 'closed',
        interactionSid: flexInteractionSid,
        channelSid: flexInteractionChannelSid,
        participantSid: removeFlexInteractionParticipantSid,
        context,
        attempts: 0,
      });

    console.log(
      'participantInvite',
      participantInvite,
      JSON.stringify(participantInvite.routing),
      JSON.stringify(participantInvite.routing.reservation),
      JSON.stringify(participantInvite.routing.properties),
    );

    response.setStatusCode(201);
    response.setBody({
      success: true,
      message: `Participant invite ${participantInvite.sid}`,
      participantInviteSid: participantInvite.sid,
      invitesTaskSid: participantInvite.routing.properties.sid,
    });
    return callback(null, response);
  } catch (error) {
    console.error(`Unexpected error occurred in ${scriptName}: ${error}`);
    response.setStatusCode(500);
    response.setBody({ success: false, message: error });
    return callback(null, response);
  }
});

const sendErrorReply = (callback, response, scriptName, status, message) => {
  console.error(`Unexpected error occurred in ${scriptName}: ${message}`);
  response.setStatusCode(status);
  response.setBody({ success: false, message });
  return callback(null, response);
};
