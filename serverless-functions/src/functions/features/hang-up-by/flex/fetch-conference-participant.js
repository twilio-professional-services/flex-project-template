const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const ConferenceOperations = require(Runtime.getFunctions()['common/twilio-wrappers/conference-participant'].path);

const requiredParameters = [
  { key: 'conference', purpose: 'unique ID of conference to update' },
  { key: 'participant', purpose: 'unique ID of participant to update' },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { conference, participant } = event;

    const result = await ConferenceOperations.fetchParticipant({
      context,
      conference,
      participant,
      attempts: 0,
    });

    const { success, participantsResponse, status, message, twilioErrorCode, twilioDocPage } = result;

    response.setStatusCode(status);
    response.setBody({ success, participantsResponse, message, twilioErrorCode, twilioDocPage });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
