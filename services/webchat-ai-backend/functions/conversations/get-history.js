exports.handler = async (context, event, callback) => {
  const { ACCOUNT_SID, AUTH_TOKEN } = context;
  const { chatSid } = event;
  const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

  try {
    const messages = await client.conversations.v1
      .conversations(chatSid)
      .messages.list();

    const formatMessage = (body, author) => ({
      role: author.includes("CH") ? "assistant" : "user",
      content: body,
    });

    const history = messages.map(({ body, author }) =>
      formatMessage(body, author)
    );

    const truncatedHistory = history.slice(-4);

    callback(null, truncatedHistory);
  } catch (error) {
    console.log(error);
    callback(null, error);
  }
};
