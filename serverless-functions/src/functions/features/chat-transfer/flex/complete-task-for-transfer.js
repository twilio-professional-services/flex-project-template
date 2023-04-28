const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const TaskOperations = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);
const ChatOperations = require(Runtime.getFunctions()['features/chat-transfer/common/chat-operations'].path);

const requiredParameters = [
  { key: 'taskSid', purpose: 'task sid to remove the chat channel from' },
  { key: 'transferType', purpose: 'COLD or WARM transfer' },
];

/*
 * Remove the original transferred task's reference to the chat channelSid
 * this prevents Twilio's Janitor service from cleaning up the channel when
 * the original task gets completed.
 */

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { taskSid, transferType, channelSid } = event;

    if (channelSid) {
      // remove channel sid from task to prevent janitor from closing chat channel
      const removeChannelSidResult = await ChatOperations.removeChannelSidFromTask({
        context,
        taskSid,
      });

      // if it fails, abandon process and return error messages
      if (!removeChannelSidResult.success) {
        response.setStatusCode(removeChannelSidResult.status);
        response.setBody({ ...extractStandardResponse(removeChannelSidResult) });
        return callback(null, response);
      }

      // update task data in channel to show this task is no longer in flight
      // this is not critical so if it fails log error and carry on
      try {
        await ChatOperations.setTaskToCompleteOnChannel({
          context,
          taskSid,
          channelSid,
        });
      } catch (error) {
        console.error('Error updating chat channel with task sid as completed');
      }
    }

    // move the task to completed
    const reason = `Task ${transferType} Transfered to new task`;
    const completeTaskResult = await TaskOperations.completeTask({
      context,
      taskSid,
      reason,
    });

    response.setStatusCode(completeTaskResult.status);
    response.setBody({ ...extractStandardResponse(completeTaskResult) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
