const { prepareFlexFunction } = require(Runtime.getFunctions()["common/helpers/prepare-function"].path);
const ServerlessOperations = require(Runtime.getFunctions()['common/twilio-wrappers/serverless'].path);

const requiredParameters = [
  { key: 'buildSid', purpose: 'build SID to deploy' }
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  
  const { buildSid, TokenResult } = event;
  
  if (TokenResult.roles.indexOf('admin') < 0) {
    response.setStatusCode(403);
    response.setBody("Not authorized");
    callback(null, response);
    return;
  }
  
  try {
    // create deployment for this build
    const result = await ServerlessOperations.deployBuild({ context, buildSid, attempts: 0 });
    
    response.setStatusCode(result.status);
    response.setBody(result);
    callback(null, response);
  } catch (error) {
    handleError(error);
  }
});