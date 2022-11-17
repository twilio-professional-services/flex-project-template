const { prepareFlexFunction } = require(Runtime.getFunctions()["common/helpers/prepare-function"].path);
const ConferenceOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/conference-participant"
].path);

const requiredParameters = [
  { key: "conference", purpose: "unique ID of conference to update" },
  { key: "participant", purpose: "unique ID of participant to update" },
  { key: "hold", purpose: "whether to hold or unhold the participant" },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { conference, participant, hold } = event;
    
    const result = await ConferenceOperations.holdParticipant({
      context,
      conference,
      participant,
      hold: hold === "true",
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