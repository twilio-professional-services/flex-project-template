const { prepareStudioFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const VideoOperations = require(Runtime.getFunctions()['common/twilio-wrappers/programmable-video'].path);
const AccessToken = require('twilio').jwt.AccessToken;

const { VideoGrant } = AccessToken;

const requiredParameters = [
  { key: 'identity', purpose: 'username for connecting to the video room' },
  { key: 'roomName', purpose: 'video room unique name' },
];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { identity, roomName } = event;

    if (context.VIDEO_ROOM_ALLOW_CREATE !== 'true') {
      const roomsListResult = await VideoOperations.listRoomsByUniqueName({
        context,
        uniqueName: roomName,
      });

      if (!roomsListResult.rooms || !roomsListResult.rooms.length) {
        response.setStatusCode(404);
        response.setBody({ success: false, message: 'Room not found' });
        return callback(null, response);
      }
    }

    // Create an access token which we will sign and return to the client,
    const token = new AccessToken(context.ACCOUNT_SID, context.TWILIO_API_KEY, context.TWILIO_API_SECRET, {
      identity: String(identity),
    });

    // Authorize the client Frontend to connect to VIDEO
    const videoGrant = new VideoGrant({
      room: String(roomName),
    });
    token.addGrant(videoGrant);

    /*
      - Respond to the client with token
    */
    response.setBody({ token: token.toJwt() });

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
