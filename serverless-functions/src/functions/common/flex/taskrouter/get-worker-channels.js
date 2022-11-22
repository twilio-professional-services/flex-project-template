const { prepareFlexFunction } = require(Runtime.getFunctions()["common/helpers/prepare-function"].path);
const TaskRouterOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/taskrouter"
].path);

const requiredParameters = [
  { key: "workerSid", purpose: "unique ID of the worker" },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { workerSid } = event;
    const result = await TaskRouterOperations.getWorkerChannels({
      context,
      attempts: 0,
      workerSid,
    });
    const { success, status, workerChannels } = result;
    
    response.setStatusCode(status);
    response.setBody({ success, workerChannels });
    callback(null, response);
  } catch (error) {
    handleError(error);
  }
});