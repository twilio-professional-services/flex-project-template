const TokenValidator = require("twilio-flex-token-validator").functionValidator;
const ParameterValidator = require(Runtime.getFunctions()[
  "common/helpers/parameter-validator"
].path);

const prepareFunction = (context, event, callback, requiredParameters, handlerFn) => {
  const response = new Twilio.Response();
  const parameterError = ParameterValidator.validate(
    context.PATH,
    event,
    requiredParameters
  );
  
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
  response.appendHeader("Content-Type", "application/json");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  
  if (parameterError) {
    console.error(`(${context.PATH}) invalid parameters passed`);
    response.setStatusCode(400);
    response.setBody({ data: null, message: parameterError });
    callback(null, response);
    return;
  }
  
  const handleError = (error) => {
    console.error(`(${context.PATH}) Unexpected error occurred: ${error}`);
    response.setStatusCode(500);
    response.setBody({
      success: false,
      message: error,
    });
    callback(null, response);
  }
  
  return handlerFn(context, event, callback, response, handleError);
};

/**
 * Prepares the function for execution. Validates the token and other required parameters, then prepares
 * the response object with the appropriate headers, as well as an error handling function.
 *
 * @param requiredParameters    array of parameters required and their description
 * @param handlerFn             the Twilio Runtime handler function to execute
 */
exports.prepareFlexFunction = (requiredParameters, handlerFn) => {
  return TokenValidator((context, event, callback) => prepareFunction(context, event, callback, requiredParameters, handlerFn));
};

/**
 * Prepares the function for execution. Validates required parameters, then prepares
 * the response object with the appropriate headers, as well as an error handling function.
 * Note: This is only intended for protected functions, and does not validate a token.
 *
 * @param requiredParameters    array of parameters required and their description
 * @param handlerFn             the Twilio Runtime handler function to execute
 */
exports.prepareStudioFunction = (requiredParameters, handlerFn) => {
  return (context, event, callback) => prepareFunction(context, event, callback, requiredParameters, handlerFn);
};