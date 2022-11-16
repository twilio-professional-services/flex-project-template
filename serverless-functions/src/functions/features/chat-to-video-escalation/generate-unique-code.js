const { prepareFlexFunction } = require(Runtime.getFunctions()["common/helpers/prepare-function"].path);
const TaskOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/taskrouter"
].path);
const SyncOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/sync"
].path);
const randomstring = require("randomstring");

const requiredParameters = [
  {
    key: "taskSid",
    purpose: "used to update the task attributes and store in Sync document",
  },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
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
    handleError(error);
  }
});