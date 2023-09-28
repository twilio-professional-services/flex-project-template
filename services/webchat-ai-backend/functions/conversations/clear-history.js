exports.handler = async (context, event, callback) => {
  const { ACCOUNT_SID, AUTH_TOKEN } = context;
  const { chatSid } = event;
  const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

  try {
    await client.conversations.v1.conversations(chatSid).remove();

    callback(null, { body: `All ${chatSid} conversations  messages deleted` });
  } catch (error) {
    console.log(error);
    callback(null, error);
  }
};
