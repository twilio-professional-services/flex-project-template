const TokenValidator = require('twilio-flex-token-validator').functionValidator;

const FunctionHelper = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const ConversationsOperations = require(Runtime.getFunctions()['common/twilio-wrappers/conversations'].path);
const InteractionsOperations = require(Runtime.getFunctions()['common/twilio-wrappers/interactions'].path);

const getRequiredParameters = () => {
  return [
    {
      key: 'flexInteractionSid',
      purpose: 'KDxxx sid for inteactions API',
    },
    {
      key: 'flexInteractionChannelSid',
      purpose: 'UOxxx sid for interactions API',
    },
    {
      key: 'flexInteractionParticipantSid',
      purpose: 'UTxxx sid for interactions API',
    },
  ];
};

exports.handler = TokenValidator(async function chat_transfer_v2_cbm(context, event, callback) {
  const response = new Twilio.Response();

  const requiredParameters = getRequiredParameters();
  const parameterError = FunctionHelper.validateParameters(context.PATH, event, requiredParameters);

  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (Object.keys(event).length === 0) {
    console.log('Empty event object, likely an OPTIONS request');
    return callback(null, response);
  }

  if (parameterError) {
    response.setStatusCode(400);
    response.setBody({ data: null, message: parameterError });
    return callback(null, response);
  }

  try {
    const { flexInteractionSid, flexInteractionChannelSid, flexInteractionParticipantSid, conversationSid } = event;

    await InteractionsOperations.participantUpdate({
      status: 'closed',
      interactionSid: flexInteractionSid,
      channelSid: flexInteractionChannelSid,
      participantSid: flexInteractionParticipantSid,
      context,
    });

    // After leaving, check how many participants are left in the conversation.
    // Why? There is a race condition where the agents may both leave at the same time, so both
    // hit this function rather than taking the normal complete task path. That leaves
    // the interaction open with only one participant--the customer. This is undesirable, because
    // then the customer's next message won't open a new interaction until it is cleaned up in 180 days!
    const participants = await ConversationsOperations.participantList({
      conversationSid,
      limit: 100,
      context,
    });

    if (participants.participants && participants.participants.length <= 1) {
      // If the customer is alone, close it out.
      await InteractionsOperations.channelUpdate({
        status: 'closed',
        interactionSid: flexInteractionSid,
        channelSid: flexInteractionChannelSid,
        context,
      });
    }

    response.setStatusCode(201);
    response.setBody({
      success: true,
    });
    return callback(null, response);
  } catch (error) {
    console.error(`Unexpected error occurred in ${scriptName}: ${error}`);
    response.setStatusCode(500);
    response.setBody({ success: false, message: error });
    return callback(null, response);
  }
});
