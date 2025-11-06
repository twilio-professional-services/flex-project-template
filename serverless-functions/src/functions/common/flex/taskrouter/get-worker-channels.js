const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [{ key: 'workerSid', purpose: 'unique ID of the worker' }];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { workerSid } = event;
    const result = await twilioExecute(context, (client) =>
      client.taskrouter.v1.workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID).workers(workerSid).workerChannels.list(),
    );
    const { status, data: workerChannels } = result;

    response.setStatusCode(status);
    response.setBody({ workerChannels, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
