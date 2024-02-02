const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const ServerlessOperations = require(Runtime.getFunctions()['common/twilio-wrappers/serverless'].path);

const requiredParameters = [{ key: 'buildSid', purpose: 'build sid to check status of' }];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const { buildSid, TokenResult } = event;

  if (TokenResult.roles.indexOf('admin') < 0) {
    response.setStatusCode(403);
    response.setBody('Not authorized');
    return callback(null, response);
  }

  try {
    // get status of the given build sid
    const buildStatusResult = await ServerlessOperations.fetchBuildStatus({ context, attempts: 0, buildSid });

    response.setStatusCode(buildStatusResult.status);
    response.setBody(buildStatusResult);
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
