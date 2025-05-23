const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [
  {
    key: 'workerChannelSid',
    purpose: 'unique ID of the workerChannelSid to update',
  },
  { key: 'capacity', purpose: 'the new capacity' },
  { key: 'available', purpose: 'whether the channel is enabled or not' },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { workerSid, workerChannelSid, capacity, available } = event;
    // Make sure that this user is allowed to perform this action
    if (workerSid && !(event.TokenResult.roles.includes('supervisor') || event.TokenResult.roles.includes('admin'))) {
      response.setStatusCode(403);
      response.setBody({ success: false, error: 'User does not have the permissions to perform this action.' });
      return callback(null, response);
    }

    const result = await twilioExecute(context, (client) =>
      client.taskrouter.v1
        .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
        .workers(workerSid ?? event.TokenResult.worker_sid)
        .workerChannels(workerChannelSid)
        .update({ capacity: Number(capacity), available: available === 'true' }),
    );
    const { status, data: workerChannelCapacity } = result;

    response.setStatusCode(status);
    response.setBody({ workerChannelCapacity, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
