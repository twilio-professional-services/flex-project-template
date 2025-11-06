const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const result = await twilioExecute(context, (client) =>
      client.taskrouter.v1.workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID).taskQueues.list({ limit: 1000 }),
    );
    const { data: fullQueueData, status } = result;
    const queues = fullQueueData
      ? fullQueueData.map((queue) => {
          const { targetWorkers, friendlyName, sid } = queue;
          return { targetWorkers, friendlyName, sid };
        })
      : null;
    response.setStatusCode(status);
    response.setBody({ queues, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
