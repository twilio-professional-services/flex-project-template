const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const VideoOperations = require(Runtime.getFunctions()['common/twilio-wrappers/programmable-video'].path);

const requiredParameters = [
  {
    key: 'roomSid',
    purpose: 'unique sid of video room to complete',
  },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { roomSid } = event;

    const roomResult = await VideoOperations.completeRoom({
      context,
      roomSid,
    });

    response.setStatusCode(roomResult.status);
    response.setBody({ success: roomResult.success });

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
