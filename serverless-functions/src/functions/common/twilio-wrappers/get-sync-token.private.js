const AccessToken = require('twilio').jwt.AccessToken;

const SyncGrant = AccessToken.SyncGrant;

// Used by other other functions
exports.getSyncToken = async (context) => {
  // Used when generating any kind of tokens
  // To set up environmental variables, see http://twil.io/secure
  const twilioAccountSid = context.ACCOUNT_SID;
  const twilioApiKey = context.TWILIO_API_KEY;
  const twilioApiSecret = context.TWILIO_API_SECRET;
  const twilioSyncService = context.TWILIO_FLEX_SYNC_SID;

  // Used specifically for creating Sync tokens
  const identity = 'SyncTokenUser';

  // Create a "grant" which enables a client to use Sync as a given user
  const syncGrant = new SyncGrant({
    serviceSid: twilioSyncService,
  });

  try {
    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret, { identity });
    token.addGrant(syncGrant);

    return { token: token.toJwt() };
  } catch (error) {
    return error;
  }
};
