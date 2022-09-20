const TokenValidator = require("twilio-flex-token-validator").functionValidator;
const ParameterValidator = require(Runtime.getFunctions()[
  "common/helpers/parameter-validator"
].path);
const TaskOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/taskrouter"
].path);
const SyncOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/sync"
].path);
const randomstring = require("randomstring");

exports.handler = TokenValidator(async function generateUniqueCode(
  context,
  event,
  callback
) {
  console.log("----- generateUniqueCode -----");
  const scriptName = arguments.callee.name;
  const response = new Twilio.Response();
  const requiredParameters = [
    {
      key: "taskSid",
      purpose: "used to update the task attributes and store in Sync document",
    },
  ];
  const parameterError = ParameterValidator.validate(
    context.PATH,
    event,
    requiredParameters
  );

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST");
  response.appendHeader("Content-Type", "application/json");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

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
      /* 
      - Generate a short unique id for the client-facing url
      - Create a SYNC document to store the data about this request
      - The unique code is also the unique name of the document so it's easy to find later on. 
      */
      const { taskSid } = event;
      let unique_code = "";
      let document = null;

      while (!document) {
        unique_code = randomstring.generate({
          length: context.VIDEO_CODE_LENGTH,
          charset: "alphanumeric",
        });

        document = await SyncOperations.createDocument({
          scriptName,
          attempts: 0,
          context,
          uniqueName: unique_code,
          ttl: context.VIDEO_CODE_TTL,
          data: {
            task: taskSid,
            room: null, // Will be filled-in when the agent connects and opens the Video room
          },
        });
      }

      const attributesUpdate = {
        syncDocument: document.document.sid,
      };

      const result = await TaskOperations.updateTaskAttributes({
        scriptName,
        context,
        taskSid,
        attributesUpdate: JSON.stringify(attributesUpdate),
        attempts: 0,
      });

      response.setStatusCode(result.status);
      response.setBody({
        unique_code: unique_code,
        valid_until: document.dateExpires,
        full_url: `https://${context.DOMAIN_NAME}/features/chat-to-video/index.html?code=${unique_code}`,
      });

      callback(null, response);
    } catch (error) {
      console.error(`Unexpected error occurred in ${scriptName}: ${error}`);
      response.setStatusCode(500);
      response.setBody({ success: false, message: error });
      callback(null, response);
    }
  }
});
