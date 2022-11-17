const { prepareStudioFunction } = require(Runtime.getFunctions()["common/helpers/prepare-function"].path);
const ChatOperations = require(Runtime.getFunctions()[
  "features/chat-transfer/common/chat-operations"
].path);

const requiredParameters = [
  { key: "taskSid", purpose: "taskSid to add to channel attributes" },
  { key: "channelSid", purpose: "channelSid to add task information to" },
];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { taskSid, channelSid } = event;
    const { success } = await ChatOperations.addTaskToChannel({
      context,
      taskSid,
      channelSid,
      attempts: 0,
    });
    response.setBody({ success });
    callback(null, response);
  } catch (error) {
    handleError(error);
  }
});