const { isString, isObject, isNumber, isBoolean } = require('lodash');

const retryHandler = require(Runtime.getFunctions()['common/helpers/retry-handler'].path).retryHandler;

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {boolean} parameters.recordParticipantsOnConnect the channel to be updated
 * @param {string} parameters.type the attributes to apply to the channel
 * @param {number} parameters.emptyRoomTimeout the attributes to apply to the channel
 * @param {string} parameters.uniqueName the attributes to apply to the channel
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
