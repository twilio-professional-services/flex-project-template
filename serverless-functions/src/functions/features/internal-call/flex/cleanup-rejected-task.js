const { prepareFlexFunction, twilioExecute } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const TaskOperations = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);

const requiredParameters = [
  { key: 'taskSid', purpose: 'unique ID of task to clean up' },
  { key: 'conferenceSid', purpose: 'unique ID of conference to clean up' },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { taskSid, conferenceSid } = event;

    try {
      await TaskOperations.updateTask({
        context,
        taskSid,
        updateParams: {
          assignmentStatus: 'canceled',
          reason: 'Rejected internal call',
        },
      });
    } catch {
      // Even if the task cannot be canceled, we still want to continue on to end the conference
    }

    await twilioExecute(context, (client) => client.conferences(conferenceSid).update({ status: 'completed' }));

    response.setBody({});
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
