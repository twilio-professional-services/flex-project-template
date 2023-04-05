const TokenValidator = require('twilio-flex-token-validator').functionValidator;

const ParameterValidator = require(Runtime.getFunctions()['common/helpers/parameter-validator'].path);
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
  const parameterError = ParameterValidator.validate(context.PATH, event, requiredParameters);

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
    const { flexInteractionSid, flexInteractionChannelSid, flexInteractionParticipantSid } = event;

    await InteractionsOperations.participantUpdate({
      status: 'closed',
      interactionSid: flexInteractionSid,
      channelSid: flexInteractionChannelSid,
      participantSid: flexInteractionParticipantSid,
      context,
      attempts: 0,
    });

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
