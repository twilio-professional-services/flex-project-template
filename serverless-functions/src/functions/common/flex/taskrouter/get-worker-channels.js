const TokenValidator = require("twilio-flex-token-validator").functionValidator;
const ParameterValidator = require(Runtime.getFunctions()[
  "common/helpers/parameter-validator"
].path);
const TaskRouterOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/taskrouter"
].path);

exports.handler = TokenValidator(async function getWorkerChannels(
  context,
  event,
  callback
) {
  const scriptName = arguments.callee.name;
  const response = new Twilio.Response();
  const requiredParameters = [
    { key: "workerSid", purpose: "unique ID of the worker" },
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
    console.error(`${scriptName} invalid parameters passed`);
    response.setStatusCode(400);
    response.setBody({ data: null, message: parameterError });
    callback(null, response);
    return;
  }
  
  try {
    const { workerSid } = event;
    const result = await TaskRouterOperations.getWorkerChannels({
      scriptName,
      context,
      attempts: 0,
      workerSid,
    });
    const { success, status, workerChannels } = result;
  
    response.setStatusCode(status);
    response.setBody({ success, workerChannels });
    callback(null, response);
  } catch (error) {
    console.log(error);
    response.setStatusCode(500);
    response.setBody({ data: null, message: error.message });
    callback(null, response);
  }
});
