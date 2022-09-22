const randomstring = require("randomstring");
const AccessToken = require("twilio").jwt.AccessToken;
const SyncOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/sync"
].path);
const ParameterValidator = require(Runtime.getFunctions()[
  "common/helpers/parameter-validator"
].path);
const { VideoGrant } = AccessToken;

exports.handler = async function clientGetVideoToken(context, event, callback) {
  console.log("----- clientGetVideoToken -----");
  const scriptName = arguments.callee.name;
  const response = new Twilio.Response();
  const requiredParameters = [
    { key: "code", purpose: "used for connecting to the video room" },
  ];
  const parameterError = ParameterValidator.validate(
    context.PATH,
    event,
    requiredParameters
  );

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  if (Object.keys(event).length === 0) {
    console.log("Empty event object, likely an OPTIONS request");
    return callback(null, response);
  }

  if (parameterError) {
    response.setStatusCode(400);
    response.setBody({ data: null, message: parameterError });
    callback(null, response);
  } else {
    try {
      const { code } = event;

      // Validate that the unique code is valid, i.e.: that the SYNC document exists
      const documentData = await SyncOperations.fetchDocument({
        scriptName,
        attempts: 0,
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
      let room_name = document.data.room;
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
      const token = new AccessToken(
        context.ACCOUNT_SID,
        context.TWILIO_API_KEY,
        context.TWILIO_API_SECRET,
        { identity: client_identity }
      );

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

      callback(null, response);
    } catch (error) {
      console.error(`Unexpected error occurred in ${scriptName}: ${error}`);
      response.setStatusCode(500);
      response.setBody({ success: false, message: error });
      callback(null, response);
    }
  }
};
