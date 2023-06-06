const { prepareStudioFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const twilio = require('twilio');

const requiredParameters = [];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const assetPath = '/config.json';
  const { apiKey, apiSecret } = event;

  // Validate provided credentials
  try {
    const client = twilio(apiKey, apiSecret, { accountSid: context.ACCOUNT_SID });
    await client.serverless.v1.services(context.SERVICE_SID).fetch();
  } catch (error) {
    response.setBody('Unauthorized');
    response.setStatusCode(401);
    return callback(null, response);
  }

  // load data
  const openData = Runtime.getAssets()[assetPath].open;
  const data = JSON.parse(openData());

  response.setBody(data);
  return callback(null, response);
});
