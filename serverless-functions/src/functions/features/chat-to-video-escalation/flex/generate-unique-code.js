const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const TaskOperations = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);
const VideoOperations = require(Runtime.getFunctions()['common/twilio-wrappers/programmable-video'].path);
const randomstring = require('randomstring');

const requiredParameters = [
  {
    key: 'taskSid',
    purpose: 'used to update the task attributes with the room name',
  },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    /* 
    - Generate a short unique id for the client-facing url
    - The unique code is also the unique name of the room so it's easy to find later on. 
    */
    const { taskSid } = event;
    const length = Number(context.VIDEO_CODE_LENGTH);

    const uniqueName = randomstring.generate({
      length: length ? length : 32,
      charset: 'alphanumeric',
    });

    const roomResult = await VideoOperations.createRoom({
      context,
      recordParticipantsOnConnect: context.VIDEO_RECORD_BY_DEFAULT === 'true',
      type: context.VIDEO_ROOM_TYPE,
      emptyRoomTimeout: Number(context.VIDEO_CODE_TTL),
      uniqueName,
    });

    const attributesUpdate = {
      videoRoom: uniqueName,
      videoRoomSid: roomResult?.room?.sid,
    };

    await TaskOperations.updateTaskAttributes({
      context,
      taskSid,
      attributesUpdate: JSON.stringify(attributesUpdate),
    });

    response.setStatusCode(roomResult.status);
    response.setBody({
      roomName: uniqueName,
      roomSid: roomResult.sid,
    });

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
