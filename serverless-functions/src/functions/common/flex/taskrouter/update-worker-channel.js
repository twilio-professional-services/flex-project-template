const TokenValidator = require("twilio-flex-token-validator").functionValidator;
const ParameterValidator = require(Runtime.getFunctions()[
  "common/helpers/parameter-validator"
].path);
const TaskRouterOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/taskrouter"
].path);

exports.handler = TokenValidator(async function updateWorkerChannel(
  context,
  event,
  callback
) {
  const scriptName = arguments.callee.name;
  const response = new Twilio.Response();
  const requiredParameters = [
    { key: "workerSid", purpose: "unique ID of the worker" },
    {
      key: "workerChannelSid",
      purpose: "unique ID of the workerChannelSid to update",
    },
    { key: "capacity", purpose: "the new capacity" },
    { key: "available", purpose: "whether the channel is enabled or not" },
  ];
  const parameterError = ParameterValidator.validate(
    context.PATH,
    event,
    requiredParameters
  );

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST");
  response.appendHeader("Content-Type", "application/json");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  if (parameterError) {
    console.error("update-attributes invalid parameters passed");
    response.setStatusCode(400);
    response.setBody({ data: null, message: parameterError });
    callback(null, response);
  } else {
    
    // Make sure that this user is allowed to perform this action
    if (!(event.TokenResult.roles.includes('supervisor') || event.TokenResult.roles.includes('admin'))) {
      response.setStatusCode(403)
      response.setBody({success: false, error: "User does not have the permissions to perform this action."});
      return callback(null, response);
    }
    
    try {
      const { workerSid, workerChannelSid, capacity, available } = event;
      const result = await TaskRouterOperations.updateWorkerChannel({
        scriptName,
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
      console.log(error);
      response.setStatusCode(500);
      response.setBody({ data: null, message: error.message });
      callback(null, response);
    }
  }
});
