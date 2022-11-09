const TokenValidator = require("twilio-flex-token-validator").functionValidator;
const ParameterValidator = require(Runtime.getFunctions()[
  "common/helpers/parameter-validator"
].path);
const TaskOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/taskrouter"
].path);
const ChatOperations = require(Runtime.getFunctions()[
  "features/chat-transfer/common/chat-operations"
].path);

/*
 * Remove the original transferred task's reference to the chat channelSid
 * this prevents Twilio's Janitor service from cleaning up the channel when
 * the original task gets completed.
 */

exports.handler = TokenValidator(async function completeTaskForTransfer(
  context,
  event,
  callback
) {
  const scriptName = arguments.callee.name;
  const response = new Twilio.Response();
  const requiredParameters = [
    { key: "taskSid", purpose: "task sid to remove the chat channel from" },
    { key: "transferType", purpose: "COLD or WARM transfer" },
    { key: "channelSid", purpose: "Channel id associated with task" },
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

  if (Object.keys(event).length === 0) {
    console.log("Empty event object, likely an OPTIONS request");
    return callback(null, response);
  }

  if (parameterError) {
    response.setStatusCode(400);
    response.setBody({ data: null, message: parameterError });
    callback(null, response);
  } else {
    try {
      const { taskSid, transferType, channelSid } = event;

      // remove channel sid from task to prevent janitor from closing chat channel
      const { success: removeSidSuccess, message } =
        await ChatOperations.removeChannelSidFromTask({
          scriptName,
          context,
          taskSid,
          attempts: 0,
        });
      if (!removeSidSuccess) return { success: removeSidSuccess, message };

      // update task data in channel to show this task is no longer in flight
      try {
        await ChatOperations.setTaskToCompleteOnChannel({
          scriptName,
          context,
          taskSid,
          channelSid,
          attempts: 0,
        });
      } catch (error) {
        console.error("Error updating chat channel with task sid as completed");
      }

      // move the task to completed
      const reason = `Task ${transferType} Transfered to new task`;
      const { success: completeTaskSuccess, message: completeTaskMessage } =
        await TaskOperations.completeTask({context, taskSid, reason, scriptName, attempts: 0});
      response.setBody({ success: completeTaskSuccess, message });
      callback(null, response);
    } catch (error) {
      console.log(error);
      response.setStatusCode(500);
      response.setBody({ success: false, message: error.message });
      callback(null, response);
    }
  }
});
