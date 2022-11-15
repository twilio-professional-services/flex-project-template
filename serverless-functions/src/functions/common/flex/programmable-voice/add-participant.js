const { prepareFlexFunction } = require(Runtime.getFunctions()["common/helpers/prepare-function"].path);
const ConferenceOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/conference-participant"
].path);

const requiredParameters = [
  { key: "taskSid", purpose: "unique ID of task to update" },
  { key: "to", purpose: "number to add to the conference" },
  { key: "from", purpose: "caller ID to use when adding to the conference" },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { taskSid, to, from } = event;
    
    const result = await ConferenceOperations.addParticipant({
      context,
      taskSid,
      to,
      from,
      attempts: 0,
    });
    
    const { success, participantsResponse, status } = result;
    
    response.setStatusCode(status);
    response.setBody({ success, participantsResponse });
    callback(null, response);
  } catch (error) {
    handleError(error);
  }
});