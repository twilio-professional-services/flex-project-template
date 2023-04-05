const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/prepare-function'].path);
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
      const { success: removeSidSuccess, message } = await ChatOperations.removeChannelSidFromTask({
        context,
        taskSid,
        attempts: 0,
      });
      if (!removeSidSuccess) return { success: removeSidSuccess, message };

      // update task data in channel to show this task is no longer in flight
      try {
        await ChatOperations.setTaskToCompleteOnChannel({
          context,
          taskSid,
          channelSid,
          attempts: 0,
        });
      } catch (error) {
        console.error('Error updating chat channel with task sid as completed');
      }
    }

    // move the task to completed
    const reason = `Task ${transferType} Transfered to new task`;
    const { success: completeTaskSuccess, message: completeTaskMessage } = await TaskOperations.completeTask({
      context,
      taskSid,
      reason,
      attempts: 0,
    });
    response.setBody({ success: completeTaskSuccess, completeTaskMessage });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
