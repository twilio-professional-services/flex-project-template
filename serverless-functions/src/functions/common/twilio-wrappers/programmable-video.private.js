const { isString, isObject, isNumber, isBoolean } = require('lodash');

const retryHandler = require(Runtime.getFunctions()['common/helpers/retry-handler'].path).retryHandler;

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {boolean} parameters.recordParticipantsOnConnect whether the video room should be recorded
 * @param {string} parameters.type the type of video room
 * @param {number} parameters.emptyRoomTimeout the idle timeout for the room
 * @param {string} parameters.uniqueName the unique name of the video room
 * @returns {object} An object containing the new room
 * @description the following method is used to create a video room
 */
exports.createRoom = async function createRoom(parameters) {
  const { context, recordParticipantsOnConnect, type, emptyRoomTimeout, uniqueName } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isBoolean(recordParticipantsOnConnect))
    throw new Error('Invalid parameters object passed. Parameters must contain recordParticipantsOnConnect boolean');
  if (!isString(type)) throw new Error('Invalid parameters object passed. Parameters must contain type string');
  if (!isNumber(emptyRoomTimeout))
    throw new Error('Invalid parameters object passed. Parameters must contain emptyRoomTimeout number');
  if (!isString(uniqueName))
    throw new Error('Invalid parameters object passed. Parameters must contain uniqueName string');

  try {
    const client = context.getTwilioClient();
    const room = await client.video.v1.rooms.create({
      recordParticipantsOnConnect,
      type,
      emptyRoomTimeout,
      uniqueName,
    });

    if (!room) return { success: false, message: 'room not created' };

    return { success: true, status: 200, room };
  } catch (error) {
    return retryHandler(error, parameters, exports.createRoom);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.roomSid the unique sid of the video room
 * @returns {object} An object containing the new room
 * @description the following method is used to complete a video room
 */
exports.completeRoom = async function completeRoom(parameters) {
  const { context, roomSid } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(roomSid)) throw new Error('Invalid parameters object passed. Parameters must contain roomSid string');

  try {
    const client = context.getTwilioClient();
    const room = await client.video.v1.rooms(roomSid).update({ status: 'completed' });

    if (!room) return { success: false, message: 'room not updated' };

    return { success: true, status: 200, room };
  } catch (error) {
    return retryHandler(error, parameters, exports.completeRoom);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.uniqueName the unique name of the video room
 * @returns {object} An object containing the new room
 * @description the following method is used to list video rooms by unique name
 */
exports.listRoomsByUniqueName = async function listRoomsByUniqueName(parameters) {
  const { context, uniqueName } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(uniqueName))
    throw new Error('Invalid parameters object passed. Parameters must contain uniqueName string');

  try {
    const client = context.getTwilioClient();
    const rooms = await client.video.v1.rooms.list({ uniqueName });

    if (!rooms) return { success: false, message: 'unable to list rooms' };

    return { success: true, status: 200, rooms };
  } catch (error) {
    return retryHandler(error, parameters, exports.listRoomsByUniqueName);
  }
};
