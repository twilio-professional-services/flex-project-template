const Helpers = require(Runtime.getFunctions()["helpers/index"].path);
const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (context, event, callback) => {
  const { OPENAI_KEY } = context;
  const { history, user_data, products, orders } = event;
  const helpers = new Helpers(context, event);
  const configuration = new Configuration({ apiKey: OPENAI_KEY });
  const openai = new OpenAIApi(configuration);

  const parsedHistory = JSON.parse(history);

  const customer = {
    user_data,
    orders,
  };

  console.log(`customer data ${JSON.stringify(customer, null, 2)}`);

  try {
    const messages = [
      {
        role: "system",
        content: `You are a helpful assistant working to provide customer support for Positronics, a retail store. 
        This is the information of the customer that you are supporting: ${JSON.stringify(
          customer
        )}. Always use it when necessary to check user preferences and orders.
        
          If the user asks to speak to an agent, ensure that there is always an agent available to handle the conversation. 
          If the user asks to clear the chat history, respond with 'Sure, I can clear your chat history.
          Never let customer waiting for a response.
          
          This is the only products available in our store: ${products}, so you have information about stock, color and price so users can inquire about them, do not talk about other products. 
  
          Always use history messages as context.
    
          If the user greets you for the first time, offer the user these use cases:
          - Product Recommendations: Ask users what they're looking for and always provide personalized recommendations based on their preferences and data provided above.
          - Order Tracking: Allow users to check the status of their orders and provide updates on delivery timings.
          - Returns and Exchanges: Help users initiate returns or exchanges and provide information on the process.
          - Talk to Agent: Provide the user with the ability to talk to a human agent.
  
          If it is not the first interaction with the use, keep assisting with the subject.
  
          Remember to keep your responses concise and focused.`,
      },
      ...parsedHistory,
    ];

    const answer = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-16k",
      messages,
      temperature: 0.0,
    });

    callback(null, { body: answer.data.choices[0].message.content });
  } catch (error) {
    console.log(error);
    const errorResponse = helpers.twilio.internalServerError(error.message);
    callback(null, errorResponse);
  }
};
