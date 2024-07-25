const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const TaskRouterOperations = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);
const CallbackOperations = require(Runtime.getFunctions()['features/callback-and-voicemail/common/callback-operations']
  .path);

const requiredParameters = [{ key: 'taskSid', purpose: 'the callback task SID to requeue' }];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { taskSid: originalTaskSid } = event;

    const { data: originalTask } = await TaskRouterOperations.fetchTask({
      context,
      taskSid: originalTaskSid,
    });

    const result = await CallbackOperations.createCallbackTask({
      context,
      originalTask,
    });

    const { status, taskSid } = result;
    response.setStatusCode(status);
    response.setBody({ taskSid, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
