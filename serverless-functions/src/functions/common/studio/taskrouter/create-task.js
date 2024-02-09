const { prepareStudioFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const TaskRouterOperations = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);

const requiredParameters = [
  { key: 'workflowSid', purpose: 'workflow to execute' },
  { key: 'taskChannel', purpose: 'task channel for task' },
  { key: 'attributes', purpose: 'attributes for task' },
];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { workflowSid, taskChannel, attributes, priority, timeout } = event;

    const result = await TaskRouterOperations.createTask({
      context,
      workflowSid,
      taskChannel,
      attributes: JSON.parse(attributes),
      priority,
      timeout,
    });

    const { data: task, status } = result;

    response.setStatusCode(status);
    response.setBody({ task, taskSid: task.sid, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
