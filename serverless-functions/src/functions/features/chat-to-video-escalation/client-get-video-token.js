const { prepareStudioFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const randomstring = require('randomstring');
const AccessToken = require('twilio').jwt.AccessToken;

const SyncOperations = require(Runtime.getFunctions()['common/twilio-wrappers/sync'].path);
const { VideoGrant } = AccessToken;

const requiredParameters = [{ key: 'code', purpose: 'used for connecting to the video room' }];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { code } = event;

    // Validate that the unique code is valid, i.e.: that the SYNC document exists
    const documentData = await SyncOperations.fetchDocument({
      context,
      documentSid: code,
    });

    if (!documentData) {
      response.setStatusCode(403);
      response.setBody({ error: `Invalid code.` });
      return callback(null, response);
    }

    // Check if the video room was created already (i.e.: is the agent connected?)
    const { document } = documentData;
    const room_name = document.data.room;
    if (!room_name) {
      response.setStatusCode(405);
      response.setBody({
        error: `The agent is not yet connected. Please try again later.`,
      });
      return callback(null, response);
    }

    /*
      - Generate a random identity for the customer
      - Note: could be replaced with additional data passed to the function
    */
    const client_identity = randomstring.generate();

    // Create an access token which we will sign and return to the client,
    const token = new AccessToken(context.ACCOUNT_SID, context.TWILIO_API_KEY, context.TWILIO_API_SECRET, {
      identity: client_identity,
    });

    // Authorize the client Frontend to connect to VIDEO
    const videoGrant = new VideoGrant({
      room: room_name,
    });
    token.addGrant(videoGrant);

    /*
      - Respond to the client with identity and token
      - Frontend JS can subscribe to the SYNC document and get notified when the agent connects
    */
    response.setBody({ token: token.toJwt() });

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
