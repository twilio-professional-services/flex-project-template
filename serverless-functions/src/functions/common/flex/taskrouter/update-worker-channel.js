const { prepareFlexFunction } = require(Runtime.getFunctions()["common/helpers/prepare-function"].path);
const TaskRouterOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/taskrouter"
].path);

const requiredParameters = [
  { key: "workerSid", purpose: "unique ID of the worker" },
  {
    key: "workerChannelSid",
    purpose: "unique ID of the workerChannelSid to update",
  },
  { key: "capacity", purpose: "the new capacity" },
  { key: "available", purpose: "whether the channel is enabled or not" },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    // Make sure that this user is allowed to perform this action
    if (!(event.TokenResult.roles.includes('supervisor') || event.TokenResult.roles.includes('admin'))) {
      response.setStatusCode(403)
      response.setBody({success: false, error: "User does not have the permissions to perform this action."});
      return callback(null, response);
    }
    
    const { workerSid, workerChannelSid, capacity, available } = event;
    const result = await TaskRouterOperations.updateWorkerChannel({
      context,
      attempts: 0,
      workerSid,
      workerChannelSid,
      capacity: Number(capacity),
      available: available === "true",
    });
    const { success, message, status, workerChannelCapacity } = result;
    
    response.setStatusCode(status);
    response.setBody({ success, message, workerChannelCapacity });
    callback(null, response);
  } catch (error) {
    handleError(error);
  }
});