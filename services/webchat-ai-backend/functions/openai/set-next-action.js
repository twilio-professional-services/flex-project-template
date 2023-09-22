const Helpers = require(Runtime.getFunctions()["helpers/index"].path);
const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (context, event, callback) => {
  const { OPENAI_KEY } = context;
  const configuration = new Configuration({ apiKey: OPENAI_KEY });
  const helpers = new Helpers(context, event);
  const openai = new OpenAIApi(configuration);

  const { history } = event;

  try {
    const prompt = `You are a helpful assistant that assists choosing the correct numeral number. Review customer discussions and infer the best number option. 
    
    You must only respond in one string character. Do not provide any content or description other than one string character.

    1. "Talk to agent": Only when the user asks to talk to a human agent or specialist.
    2. "Clear history": If the user asks to clear or delete the conversation history.
    3. "null": None action is necessary.

    Examples:
    
    Message: I would like to talk to agent
    Other: Sure, I can connect you with an agent.
    Response: 1

    Message: Clear history
    Other: Sure, I can clear our chat history.
    Response: 2
    
    Message: Thank you!
    Other: Of course, let me know if you need anything.
    Response: 3`;

    const messages = [
      {
        role: "system",
        content: prompt,
      },
      ...JSON.parse(history),
    ];

    const answer = await openai.createChatCompletion({
      model: "gpt-4",
      messages,
      temperature: 0.0,
      top_p: 0.1,
    });

    console.log("Return message", answer.data.choices[0].message);

    const optionNumber = answer.data.choices[0].message.content;
    const options = ["talk_to_agent", "clear_history", "null"];
    const nextAction =
      optionNumber.length > 0 ? options[optionNumber - 1] : options[0];

    console.log("Next action", nextAction);

    callback(null, nextAction);
  } catch (error) {
    console.log(error);
    const errorResponse = helpers.twilio.internalServerError(error);
    callback(null, errorResponse);
  }
};
