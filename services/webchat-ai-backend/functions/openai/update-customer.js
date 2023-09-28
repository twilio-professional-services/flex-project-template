const Helpers = require(Runtime.getFunctions()["helpers/index"].path);
const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (context, event, callback) => {
  const helpers = new Helpers(context, event);
  const { OPENAI_KEY } = context;

  const configuration = new Configuration({ apiKey: OPENAI_KEY });
  const openai = new OpenAIApi(configuration);

  const { history, user_data } = event;
  const { traits } = user_data;

  try {
    const prompt = `You are a data analyst. Your job is to review customer discussions and infer some new properties for that customer that would be helpful to save onto their profile for future use. This is the current customer data: ${user_data}. If there are no new traits, then please return the current customer data.

    You must only respond in valid JSON. Do not provide any content or description other than JSON.
    
    If you see something related to these traits, prefer updating the value for these traits: ${Object.keys(
      traits
    ).join(",")}.
    
    Examples:
    
    Message: I'm hungry
    Other: What would you like to eat?
    Message: Pancakes
    { "favorite_food": "pancakes" }
    
    Message: Can you send me the notes from today's meeting?
    Other: Sure, what email should I use?
    Message: example@example.com
    { "email": "example@example.com" }
    
    Message: Good morning
    Other: Hi, what's your name?
    Message: Dominik Kundel, but you can call me Dom
    { "first_name": "Dominik", "last_name": "Kundel", "nickname": "Dom" }
    
    Message: You can take the front gate
    Other: What's the code?
    Message: 8842
    { "gate_code": "8842" }
    
    Message: I'm looking for new shoes
    Other: What's the size?
    Message: 11
    { "shoe_size": 11 }`;

    const messages = [
      {
        role: "system",
        content: prompt,
      },
      ...history,
    ];

    const answer = await openai.createChatCompletion({
      model: "gpt-4",
      messages,
      temperature: 0.0,
      top_p: 0.1,
    });

    const response = answer.data.choices[0].message.content;
    const new_trait = JSON.parse(response);

    console.log(`new trait ${JSON.stringify(new_trait, null, 2)}`);

    const data = {
      userId: user_data.user_id,
      traits: {
        ...traits,
        ...new_trait,
      },
    };

    await helpers.segment.updateUser(data);

    callback(null, new_trait);
  } catch (error) {
    console.log(error);
    const errorResponse = helpers.twilio.internalServerError(error.message);
    callback(null, errorResponse);
  }
};
