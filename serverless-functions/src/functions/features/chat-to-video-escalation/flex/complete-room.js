const { prepareFlexFunction, twilioExecute } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);

const requiredParameters = [
  {
    key: 'roomSid',
    purpose: 'unique sid of video room to complete',
  },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { roomSid } = event;

    const roomResult = await twilioExecute(context, (client) =>
      client.video.v1.rooms(roomSid).update({ status: 'completed' }),
    );

    response.setStatusCode(roomResult.status);
    response.setBody({ success: roomResult.success });

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
