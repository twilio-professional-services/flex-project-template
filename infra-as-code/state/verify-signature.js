const fs = require("fs");
const twilio = require("twilio");

// .
exports.handler = async (context, event, callback) => {
  const response = new Twilio.Response();

  const { apiKey, apiSecret, assetKey } = event;

  try {
    const client = twilio(apiKey, apiSecret, {
      accountSid: context.ACCOUNT_SID,
    });
    await client.serverless.v1.services(context.SERVICE_SID).fetch();
  } catch (error) {
    response.setBody("Unauthorized");
    response.setStatusCode(401);
    return callback(null, response);
  }

  const path = Runtime.getAssets()[`/${assetKey}`].path;

  const data = fs.readFileSync(path);

  response.appendHeader("Content-Type", "application/gzip");
  response.appendHeader(
    "Content-Disposition",
    `attachment; filename="${assetKey}"`
  );

  response.setBody(data);

  return callback(null, response);
};
