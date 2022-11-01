const TokenValidator = require('twilio-flex-token-validator').functionValidator;
const ParameterValidator = require(Runtime.getFunctions()['common/helpers/parameter-validator'].path);
const ServerlessOperations = require(Runtime.getFunctions()['common/twilio-wrappers/serverless'].path);

exports.handler = TokenValidator(async function publish(context, event, callback) {
  const scriptName = arguments.callee.name;
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  const requiredParameters = [
    { key: 'buildSid', purpose: 'build SID to deploy' }
  ];
  const parameterError = ParameterValidator.validate(context.PATH, event, requiredParameters);
  
  if (parameterError) {
    response.setStatusCode(400);
    response.setBody({ parameterError });
    callback(null, response);
    return;
  }
  
  const { buildSid, TokenResult } = event;
  
  if (TokenResult.roles.indexOf('admin') < 0) {
    response.setStatusCode(403);
    response.setBody("Not authorized");
    callback(null, response);
    return;
  }
  
  try {
    // create deployment for this build
    const result = await ServerlessOperations.deployBuild({ scriptName, context, buildSid, attempts: 0 });
    
    response.setStatusCode(result.status);
    response.setBody(result)
  } catch (error) {
    console.log(error);
    
    response.setStatusCode(500);
    response.setBody({ message: error.message });
  }
  
  callback(null, response);
});
