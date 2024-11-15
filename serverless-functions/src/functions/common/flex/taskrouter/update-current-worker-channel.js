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
    const { workerChannelSid, capacity, available } = event;
    const result = await twilioExecute(context, (client) =>
      client.taskrouter.v1
        .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
        .workers(event.TokenResult.worker_sid)
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
