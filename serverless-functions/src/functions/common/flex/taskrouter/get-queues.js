const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const TaskRouterOperations = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);

const requiredParameters = [];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const result = await TaskRouterOperations.getQueues({
      context,
      attempts: 0,
    });
    const { success, queues: fullQueueData, message, status, twilioDocPage, twilioErrorCode } = result;
    const queues = fullQueueData
      ? fullQueueData.map((queue) => {
          const { targetWorkers, friendlyName, sid } = queue;
          return { targetWorkers, friendlyName, sid };
        })
      : null;
    response.setStatusCode(status);
    response.setBody({ success, queues, message, twilioDocPage, twilioErrorCode });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
