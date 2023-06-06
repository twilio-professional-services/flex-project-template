const { prepareStudioFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const randomstring = require('randomstring');
const AccessToken = require('twilio').jwt.AccessToken;

const SyncOperations = require(Runtime.getFunctions()['common/twilio-wrappers/sync'].path);
const { SyncGrant } = AccessToken;

const requiredParameters = [{ key: 'code', purpose: 'used for unique name of Sync document' }];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const client = context.getTwilioClient();
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

    /*
      - Generate a random identity for the customer
      - This could also be a name we ask to provide before joining the room
    */
    const client_identity = randomstring.generate();
    console.log('Client identity for Sync : ', client_identity);

    // Give read-only rights to the SYNC Document to this identity so the UI can subscribe to live updates
    await client.sync
      .services(context.TWILIO_FLEX_SYNC_SID)
      .documents(code)
      .documentPermissions(client_identity)
      .update({ read: true, write: false, manage: false })
      .catch((reason) => {
        console.error(`Error giving permission to ${code}: ${reason}`);
        return null;
      });

    // Create an access token which we will sign and return to the client,
    const token = new AccessToken(context.ACCOUNT_SID, context.TWILIO_API_KEY, context.TWILIO_API_SECRET, {
      identity: client_identity,
    });

    // Add grants to the SYNC document and the VIDEO room to that token
    const syncGrant = new SyncGrant({
      serviceSid: context.TWILIO_FLEX_SYNC_SID,
    });
    token.addGrant(syncGrant);

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
